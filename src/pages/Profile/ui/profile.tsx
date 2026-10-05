import styles from "./profile.module.scss";
import { useState } from "react";
import { useAuth } from "@/features/auth";
import { useGetUserDashboardQuery } from "@/entities/user/api/user-api";
import { gamesLabels } from "@/entities/game/model/games-labels";
import { difficultyData } from "@/entities/game/model/difficulty";
import { Button, CustomLinkAsButton } from "@/shared/ui/button";
import { AudioButton } from "@/shared/ui/audio-button";
import { Pagination } from "@/shared/ui/pagination";
import { CustomTable } from "@/shared/ui/table";
import { SegmentedControl } from "@/shared/ui/segmented-control";
import { Metrics, type Metric } from "@/shared/ui/metrics";
import { Spinner } from "@/shared/ui/spinner";
import { ProgressTracking } from "@/shared/ui/progress-tracking";
import { getActivityStreak, localDay, summarizeGames } from "../model/statistics";

const pageSize = 20;
const dateFormat = new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" });
const formatDate = (date: string) => dateFormat.format(new Date(date));
function gameTitle(name: string) {
    const key = name === "puzzle" ? "puzzles" : name;
    return Object.hasOwn(gamesLabels, key) ? gamesLabels[key as keyof typeof gamesLabels].title : "Другая игра";
}

export default function ProfilePage() {
    const { user } = useAuth();
    const { data, isLoading, error, refetch } = useGetUserDashboardQuery(user?.id ?? "", { skip: !user });
    const [period, setPeriod] = useState<"today" | "all">("all");
    const [wordPage, setWordPage] = useState(1);
    const [historyPage, setHistoryPage] = useState(1);
    if (!user) return null;
    if (isLoading) return <Spinner />;
    if (error || !data)
        return (
            <div className={styles.profile}>
                <h1>Профиль</h1>
                <p role="alert">Не удалось загрузить данные профиля.</p>
                <Button onClick={() => void refetch()}>Попробовать снова</Button>
            </div>
        );

    const today = localDay(new Date());
    const selectedGames =
        period === "today" ? data.games.filter(game => localDay(game.created_at) === today) : data.games;
    const stats = summarizeGames(selectedGames);
    const learned = data.progress.filter(item => item.is_learned);
    const learnedToday = learned.filter(item => item.learned_at && localDay(item.learned_at) === today).length;
    const words = learned
        .filter(item => item.words !== null)
        .toSorted((a, b) => (b.learned_at ?? "").localeCompare(a.learned_at ?? ""));
    const safeWordPage = Math.min(wordPage, Math.max(1, Math.ceil(words.length / pageSize)));
    const safeHistoryPage = Math.min(historyPage, Math.max(1, Math.ceil(selectedGames.length / pageSize)));
    const metrics: Metric[] = [
        { label: "Сыграно игр", value: stats.count, description: "Сохранённые результаты за выбранный период" },
        { label: "Всего очков", value: stats.score, description: "Сумма результатов всех игр за период" },
        { label: "Лучший результат", value: stats.best, description: "Максимум очков за одну игру" },
        {
            label: "Средняя точность",
            value: stats.accuracy === null ? "—" : `${stats.accuracy}%`,
            description: "Среднее значение точности по играм",
        },
        { label: "Новых слов в играх", value: stats.newWords, description: "Слова, впервые встреченные в тренировках" },
        { label: "Выучено в играх", value: stats.learnedWords, description: "Слова, ставшие выученными за период" },
    ];
    return (
        <div className={styles.profile}>
            <header className={styles.profile__header}>
                <div>
                    <h1>Мой профиль</h1>
                    <p>{user.email}</p>
                    <p className={styles.profile__note}>В приложении с {formatDate(user.created_at)}</p>
                </div>
            </header>
            <section className={styles.profile__section}>
                <h2>Мой словарный запас</h2>
                <Metrics
                    items={[
                        { label: "Выучено слов", value: learned.length, description: "Весь освоенный словарный запас" },
                        {
                            label: "Выучено сегодня",
                            value: learnedToday,
                            description: "Новые выученные слова за текущий день",
                        },
                        {
                            label: "Встречено слов",
                            value: data.progress.length,
                            description: "Уникальные слова из ваших тренировок",
                        },
                        {
                            label: "Ещё изучаю",
                            value: data.progress.filter(item => !item.is_learned).length,
                            description: "Встреченные слова, которые пока не выучены",
                        },
                        {
                            label: "Сложных слов",
                            value: data.progress.filter(item => item.is_difficult).length,
                            description: "Слова с отметкой «сложное»",
                        },
                        {
                            label: "Дней подряд с играми",
                            value: getActivityStreak(data.games),
                            description: "Серия тренировок, включая сегодня или вчера",
                        },
                    ]}
                />
                <h3>Выучено</h3>
                <ProgressTracking label="Выученная часть словаря" streak={learned.length} total={data.totalWords} />
                <Metrics
                    view="secondary"
                    items={difficultyData.map(level => ({
                        label: `Уровень ${level.value} — ${level.title}`,
                        value: learned.filter(item => item.words?.difficulty === level.value).length,
                        description: "выучено",
                    }))}
                />
            </section>
            <section className={styles.profile__section}>
                <h2>Выученные слова</h2>
                {words.length > 0 ? (
                    <>
                        <ul className={styles.profile__words}>
                            {words.slice((safeWordPage - 1) * pageSize, safeWordPage * pageSize).map(
                                item =>
                                    item.words && (
                                        <li key={item.word_id} className={styles.profile__word}>
                                            <AudioButton path={item.words.audio} />
                                            <div>
                                                <strong lang="en">{item.words.word}</strong>{" "}
                                                <span>{item.words.transcription}</span>
                                                <p>{item.words.word_translate}</p>
                                                <p className={styles.profile__note}>
                                                    Уровень {item.words.difficulty}
                                                    {item.is_difficult ? " · Сложное слово" : ""}
                                                    {item.learned_at ? ` · Выучено ${formatDate(item.learned_at)}` : ""}
                                                </p>
                                            </div>
                                        </li>
                                    ),
                            )}
                        </ul>
                        <Pagination
                            totalItems={words.length}
                            totalPages={Math.ceil(words.length / pageSize)}
                            currentPage={safeWordPage}
                            onPageChange={setWordPage}
                        />
                    </>
                ) : (
                    <p>
                        Пока нет выученных слов. Играйте и отвечайте правильно: обычное слово изучается после трёх
                        ответов подряд, сложное — после пяти.
                    </p>
                )}
            </section>
            <section className={styles.profile__activity}>
                <div className={styles.profile__header}>
                    <h2>Игровая активность</h2>
                    <SegmentedControl<"today" | "all">
                        label="Период статистики"
                        options={[
                            { value: "today", label: "Сегодня" },
                            { value: "all", label: "За всё время" },
                        ]}
                        value={period}
                        onChange={value => {
                            setPeriod(value);
                            setHistoryPage(1);
                        }}
                    />
                </div>
                <section className={styles.profile__section}>
                    <h3>Статистика игр</h3>
                    <p className={styles.profile__note}>
                        Даты — в вашем часовом поясе. Учитываются сохранённые игры. Точность усредняется по играм.
                    </p>
                    <Metrics items={metrics} />
                    <div className={styles.profile__table}>
                        <p className={styles.profile__note}>Результаты по играм</p>
                        <CustomTable
                            tableId="profile-statistics"
                            data={{
                                titles: [
                                    { key: "game", title: "Игра", widthInGrid: "minmax(140px, 2fr)" },
                                    { key: "count", title: "Сыграно", widthInGrid: "minmax(70px, 1fr)" },
                                    { key: "score", title: "Очки", widthInGrid: "minmax(70px, 1fr)" },
                                    { key: "best", title: "Рекорд", widthInGrid: "minmax(70px, 1fr)" },
                                    { key: "accuracy", title: "Средняя точность", widthInGrid: "minmax(130px, 1fr)" },
                                ],
                                rows: Object.entries(gamesLabels).map(([key, game]) => {
                                    const summary = summarizeGames(
                                        selectedGames.filter(
                                            item => (item.game_name === "puzzle" ? "puzzles" : item.game_name) === key,
                                        ),
                                    );
                                    return {
                                        content: {
                                            game: game.title,
                                            count: summary.count,
                                            score: summary.score,
                                            best: summary.best,
                                            accuracy: summary.accuracy === null ? "—" : `${summary.accuracy}%`,
                                        },
                                    };
                                }),
                            }}
                        />
                    </div>
                </section>
                <section className={styles.profile__section}>
                    <h3>История игр {period === "today" ? "за сегодня" : "за всё время"}</h3>
                    {selectedGames.length > 0 ? (
                        <>
                            <div className={styles.profile__table}>
                                <p className={styles.profile__note}>Сохранённые результаты, сначала новые</p>
                                <CustomTable
                                    tableId="profile-history"
                                    data={{
                                        titles: [
                                            { key: "date", title: "Дата", widthInGrid: "minmax(180px, 2fr)" },
                                            { key: "game", title: "Игра", widthInGrid: "minmax(130px, 1fr)" },
                                            { key: "score", title: "Очки", widthInGrid: "minmax(70px, 1fr)" },
                                            { key: "accuracy", title: "Точность", widthInGrid: "minmax(80px, 1fr)" },
                                            {
                                                key: "newWords",
                                                title: "Новые слова",
                                                widthInGrid: "minmax(100px, 1fr)",
                                            },
                                            { key: "learnedWords", title: "Выучено", widthInGrid: "minmax(80px, 1fr)" },
                                        ],
                                        rows: selectedGames
                                            .slice((safeHistoryPage - 1) * pageSize, safeHistoryPage * pageSize)
                                            .map(game => ({
                                                content: {
                                                    date: (
                                                        <time dateTime={game.created_at}>
                                                            {formatDate(game.created_at)}
                                                        </time>
                                                    ),
                                                    game: gameTitle(game.game_name),
                                                    score: game.score,
                                                    accuracy: `${game.accuracy}%`,
                                                    newWords: game.new_words,
                                                    learnedWords: game.learned_words,
                                                },
                                            })),
                                    }}
                                />
                            </div>
                            <Pagination
                                totalItems={selectedGames.length}
                                totalPages={Math.ceil(selectedGames.length / pageSize)}
                                currentPage={safeHistoryPage}
                                onPageChange={setHistoryPage}
                            />
                        </>
                    ) : (
                        <p>За этот период пока нет сохранённых игр.</p>
                    )}
                    <CustomLinkAsButton to="/games" className={styles.profile__btn}>
                        Начать тренировку
                    </CustomLinkAsButton>
                </section>
            </section>
        </div>
    );
}
