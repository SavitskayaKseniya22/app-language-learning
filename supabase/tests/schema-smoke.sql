-- Run only against the local database. Test records are rolled back.
BEGIN;

INSERT INTO auth.users (id, email)
VALUES ('00000000-0000-0000-0000-000000000001', 'migration-test@example.test');

INSERT INTO public.words (
    id, word, word_translate, transcription, difficulty,
    text_meaning, text_meaning_translate, text_example, text_example_translate,
    image, audio, audio_meaning, audio_example
) VALUES (
    900000001, 'hello', 'привет', '[hello]', 1,
    'Greeting', 'Приветствие', 'Hello world', 'Привет, мир',
    'test.jpg', 'test.mp3', 'meaning.mp3', 'example.mp3'
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000001') THEN
        RAISE EXCEPTION 'Registration trigger did not create a profile';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'words' AND public) THEN
        RAISE EXCEPTION 'Public words bucket is missing';
    END IF;
END;
$$;

SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);

SELECT public.finish_game(10, '[{"word_id":900000001,"is_correct":true}]'::jsonb, 'sprint');
SELECT public.finish_puzzle(10, 1, 1);

DO $$
BEGIN
    IF (SELECT count(*) FROM public.game_results) <> 2 THEN
        RAISE EXCEPTION 'Game RPCs did not save both results';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.user_word_progress WHERE word_id = 900000001 AND correct_streak = 1) THEN
        RAISE EXCEPTION 'Word progress was not updated';
    END IF;
END;
$$;

SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000002', true);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM public.game_results) OR EXISTS (SELECT 1 FROM public.user_word_progress) THEN
        RAISE EXCEPTION 'RLS exposes another user''s records';
    END IF;
END;
$$;

SET LOCAL ROLE anon;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.words WHERE id = 900000001) THEN
        RAISE EXCEPTION 'Anonymous users cannot read the textbook';
    END IF;
    BEGIN
        PERFORM public.finish_puzzle(10, 1, 1);
        RAISE EXCEPTION 'Anonymous users can invoke finish_puzzle';
    EXCEPTION WHEN insufficient_privilege THEN
        NULL;
    END;
END;
$$;

ROLLBACK;
