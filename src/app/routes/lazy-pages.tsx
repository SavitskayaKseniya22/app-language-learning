import { lazy } from "react";

export const MainPage = lazy(() => import("@/pages/main/ui/main-page"));
export const TextbookPage = lazy(() => import("@/pages/textbook/ui/textbook-page/textbook"));
export const GamesPage = lazy(() => import("@/pages/games/ui/games"));
export const SprintPage = lazy(() => import("@/pages/sprint/ui/sprint-page/sprint-page"));
export const AudiocallPage = lazy(() => import("@/pages/audiocall/ui/audiocall-page/audiocall-page"));
export const ConstructorPage = lazy(() => import("@/pages/constructor/ui/constructor-page/constructor-page"));
export const PuzzlePage = lazy(() => import("@/pages/sentences/ui/puzzle-page/puzzle-page"));
export const ResultPage = lazy(() => import("@/pages/result/ui/result-page/result-page"));
export const ProfilePage = lazy(() => import("@/pages/profile/ui/profile"));
export const CollectionPage = lazy(() => import("@/pages/collection/ui/collection"));
export const StatisticsPage = lazy(() => import("@/pages/statistics/ui/statistics"));
export const GameStartScreen = lazy(() => import("@/entities/game/ui/game-start-screen/game-start-screen"));
