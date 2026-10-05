


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."finish_game"("p_score" integer, "p_answers" "jsonb", "p_game_name" "text") RETURNS "jsonb"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
declare
  v_user_id uuid;

  v_answer jsonb;
  v_word_id bigint;
  v_is_correct boolean;

  v_progress public.user_word_progress%rowtype;

  v_is_new boolean;
  v_required_streak smallint;

  v_new_words_count integer := 0;
  v_learned_words_count integer := 0;

  v_correct_answers integer := 0;
  v_total_answers integer := 0;
  v_accuracy smallint := 0;

  v_new_word_ids bigint[] := '{}';
  v_learned_word_ids bigint[] := '{}';

  v_new_words_json jsonb := '[]'::jsonb;
  v_learned_words_json jsonb := '[]'::jsonb;

  v_game_id bigint;

begin

  -- Текущий пользователь
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'User is not authenticated';
  end if;


  -- Проверяем score
  if p_score < 0 then
    raise exception 'Score cannot be negative';
  end if;


  -- Проверяем название игры
  if p_game_name is null or trim(p_game_name) = '' then
    raise exception 'Game name is required';
  end if;


  -- Проверяем answers
  if p_answers is null
     or jsonb_typeof(p_answers) <> 'array'
  then
    raise exception 'Answers must be an array';
  end if;


  -- Обрабатываем каждый ответ
  for v_answer in
    select value
    from jsonb_array_elements(p_answers)
  loop

    v_word_id :=
      (v_answer ->> 'word_id')::bigint;

    v_is_correct :=
      (v_answer ->> 'is_correct')::boolean;


    -- Считаем ответы для accuracy
    v_total_answers :=
      v_total_answers + 1;

    if v_is_correct then
      v_correct_answers :=
        v_correct_answers + 1;
    end if;


    -- Получаем текущий прогресс слова
    select *
    into v_progress
    from public.user_word_progress
    where user_id = v_user_id
      and word_id = v_word_id
    for update;


    v_is_new := not found;


    -- Если пользователь раньше не встречал это слово
    if v_is_new then

      v_new_words_count :=
        v_new_words_count + 1;

      v_new_word_ids :=
        array_append(
          v_new_word_ids,
          v_word_id
        );

      insert into public.user_word_progress (
        user_id,
        word_id
      )
      values (
        v_user_id,
        v_word_id
      )
      returning *
      into v_progress;

    end if;


    -- Обновляем серию правильных ответов
    if v_is_correct then

      v_progress.correct_streak :=
        v_progress.correct_streak + 1;

    else

      v_progress.correct_streak := 0;

    end if;


    -- Обычное слово: 3 правильных подряд
    -- Сложное слово: 5 правильных подряд
    if v_progress.is_difficult then

      v_required_streak := 5;

    else

      v_required_streak := 3;

    end if;


    -- Проверяем, стало ли слово изученным
    if
      not v_progress.is_learned
      and v_progress.correct_streak >= v_required_streak
    then

      v_progress.is_learned := true;
      v_progress.learned_at := now();

      v_learned_words_count :=
        v_learned_words_count + 1;

      v_learned_word_ids :=
        array_append(
          v_learned_word_ids,
          v_word_id
        );

    end if;


    -- Сохраняем прогресс слова
    update public.user_word_progress
    set
      correct_streak = v_progress.correct_streak,
      is_learned = v_progress.is_learned,
      learned_at = v_progress.learned_at,
      last_seen_at = now()
    where user_id = v_user_id
      and word_id = v_word_id;

  end loop;


  -- Считаем accuracy
  if v_total_answers > 0 then

    v_accuracy :=
      round(
        v_correct_answers::numeric
        / v_total_answers::numeric
        * 100
      )::smallint;

  end if;


  -- Сохраняем результат игры.
  -- В таблице храним только количество слов.
  insert into public.game_results (
    user_id,
    game_name,
    score,
    accuracy,
    new_words,
    learned_words
  )
  values (
    v_user_id,
    p_game_name,
    p_score,
    v_accuracy,
    v_new_words_count,
    v_learned_words_count
  )
  returning id
  into v_game_id;


  -- Получаем полные данные новых слов
  select coalesce(
    jsonb_agg(to_jsonb(w)),
    '[]'::jsonb
  )
  into v_new_words_json
  from public.words w
  where w.id = any(v_new_word_ids);


  -- Получаем полные данные слов,
  -- которые стали изученными в этой игре
  select coalesce(
    jsonb_agg(to_jsonb(w)),
    '[]'::jsonb
  )
  into v_learned_words_json
  from public.words w
  where w.id = any(v_learned_word_ids);


  -- Возвращаем результат на frontend
  return jsonb_build_object(
    'game_id', v_game_id,
    'game_name', p_game_name,
    'score', p_score,
    'accuracy', v_accuracy,
    'new_words', v_new_words_json,
    'learned_words', v_learned_words_json
  );

end;
$$;


ALTER FUNCTION "public"."finish_game"("p_score" integer, "p_answers" "jsonb", "p_game_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."finish_puzzle"("p_score" integer, "p_correct_answers" integer, "p_total_answers" integer) RETURNS "jsonb"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
declare
  v_user_id uuid;
  v_game_id bigint;
  v_accuracy smallint := 0;
begin

  -- Получаем текущего пользователя
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'User is not authenticated';
  end if;


  -- Проверяем score
  if p_score < 0 then
    raise exception 'Score cannot be negative';
  end if;


  -- Проверяем количество ответов
  if p_total_answers < 0 then
    raise exception 'Total answers cannot be negative';
  end if;

  if p_correct_answers < 0 then
    raise exception 'Correct answers cannot be negative';
  end if;

  if p_correct_answers > p_total_answers then
    raise exception 'Correct answers cannot exceed total answers';
  end if;


  -- Считаем accuracy
  if p_total_answers > 0 then

    v_accuracy :=
      round(
        p_correct_answers::numeric
        / p_total_answers::numeric
        * 100
      )::smallint;

  end if;


  -- Сохраняем результат
  insert into public.game_results (
    user_id,
    game_name,
    score,
    accuracy,
    new_words,
    learned_words
  )
  values (
    v_user_id,
    'puzzle',
    p_score,
    v_accuracy,
    0,
    0
  )
  returning id
  into v_game_id;


  -- Возвращаем результат
  return jsonb_build_object(
    'game_id', v_game_id,
    'game_name', 'puzzle',
    'score', p_score,
    'accuracy', v_accuracy
  );

end;
$$;


ALTER FUNCTION "public"."finish_puzzle"("p_score" integer, "p_correct_answers" integer, "p_total_answers" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public.profiles (id, date_created)
  values (new.id, now());
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."game_results" (
    "id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "score" integer NOT NULL,
    "new_words" integer DEFAULT 0 NOT NULL,
    "learned_words" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "accuracy" smallint DEFAULT 0 NOT NULL,
    "game_name" "text" NOT NULL,
    CONSTRAINT "game_results_accuracy_check" CHECK ((("accuracy" >= 0) AND ("accuracy" <= 100)))
);


ALTER TABLE "public"."game_results" OWNER TO "postgres";


ALTER TABLE "public"."game_results" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."game_results_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "name" "text",
    "date_created" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_word_progress" (
    "user_id" "uuid" NOT NULL,
    "word_id" bigint NOT NULL,
    "is_difficult" boolean DEFAULT false NOT NULL,
    "is_learned" boolean DEFAULT false NOT NULL,
    "correct_streak" smallint DEFAULT 0 NOT NULL,
    "first_seen_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "last_seen_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "learned_at" timestamp with time zone,
    CONSTRAINT "user_word_progress_correct_streak_check" CHECK (("correct_streak" >= 0))
);


ALTER TABLE "public"."user_word_progress" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."words" (
    "word" "text" NOT NULL,
    "word_translate" "text" NOT NULL,
    "transcription" "text" NOT NULL,
    "difficulty" smallint NOT NULL,
    "text_meaning" "text" NOT NULL,
    "text_meaning_translate" "text" NOT NULL,
    "text_example" "text" NOT NULL,
    "text_example_translate" "text" NOT NULL,
    "image" "text" NOT NULL,
    "audio" "text" NOT NULL,
    "audio_meaning" "text" NOT NULL,
    "audio_example" "text" NOT NULL,
    "id" bigint NOT NULL,
    CONSTRAINT "words_difficulty_check" CHECK ((("difficulty" >= 1) AND ("difficulty" <= 6)))
);


ALTER TABLE "public"."words" OWNER TO "postgres";


ALTER TABLE "public"."words" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."words_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."game_results"
    ADD CONSTRAINT "game_results_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_word_progress"
    ADD CONSTRAINT "user_word_progress_pkey" PRIMARY KEY ("user_id", "word_id");



ALTER TABLE ONLY "public"."words"
    ADD CONSTRAINT "words_pkey" PRIMARY KEY ("id");



CREATE INDEX "words_difficulty_idx" ON "public"."words" USING "btree" ("difficulty");



ALTER TABLE ONLY "public"."game_results"
    ADD CONSTRAINT "game_results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_word_progress"
    ADD CONSTRAINT "user_word_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_word_progress"
    ADD CONSTRAINT "user_word_progress_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "public"."words"("id") ON DELETE CASCADE;



CREATE POLICY "Enable read access for all users" ON "public"."words" FOR SELECT USING (true);



CREATE POLICY "Users can delete own word progress" ON "public"."user_word_progress" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own game results" ON "public"."game_results" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own word progress" ON "public"."user_word_progress" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can read own game results" ON "public"."game_results" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can read own word progress" ON "public"."user_word_progress" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own word progress" ON "public"."user_word_progress" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."game_results" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_word_progress" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."words" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



REVOKE ALL ON FUNCTION "public"."finish_game"("p_score" integer, "p_answers" "jsonb", "p_game_name" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."finish_game"("p_score" integer, "p_answers" "jsonb", "p_game_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."finish_game"("p_score" integer, "p_answers" "jsonb", "p_game_name" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."finish_puzzle"("p_score" integer, "p_correct_answers" integer, "p_total_answers" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."finish_puzzle"("p_score" integer, "p_correct_answers" integer, "p_total_answers" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."finish_puzzle"("p_score" integer, "p_correct_answers" integer, "p_total_answers" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON TABLE "public"."game_results" TO "anon";
GRANT ALL ON TABLE "public"."game_results" TO "authenticated";
GRANT ALL ON TABLE "public"."game_results" TO "service_role";



GRANT ALL ON SEQUENCE "public"."game_results_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."game_results_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."game_results_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."user_word_progress" TO "anon";
GRANT ALL ON TABLE "public"."user_word_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."user_word_progress" TO "service_role";



GRANT ALL ON TABLE "public"."words" TO "anon";
GRANT ALL ON TABLE "public"."words" TO "authenticated";
GRANT ALL ON TABLE "public"."words" TO "service_role";



GRANT ALL ON SEQUENCE "public"."words_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."words_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."words_id_seq" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







