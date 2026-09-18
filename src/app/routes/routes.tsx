import { Route, Outlet, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { MainPage } from "@/pages/main";
import { TextbookPage } from "@/pages/textbook";
import { Sidebar } from "@/widgets/sidebar";
import { Footer } from "@/widgets/footer";
import { ErrorComponent } from "@/shared/ui/error-component";
import { GamesPage } from "@/pages/games";
import { ProfilePage } from "@/pages/profile";
import { CollectionPage } from "@/pages/collection";
import { StatisticsPage } from "@/pages/statistics";
import { GameType } from "@/entities/user";
import { PrivateRoute } from "@/features/auth";
import GameStartScreen from "@/entities/game/ui/game-start-screen/game-start-screen";
import { ModalProvider } from "@/shared/ui/modal";
import { SprintPage } from "@/pages/sprint";
import { GameDataManager, gamesLabels } from "@/entities/game";
import { AudiocallPage } from "@/pages/audiocall";
import { BlockBackground } from "@/shared/ui/block-background";
import { ConstructorPage } from "@/pages/constructor";
import { PuzzlePage } from "@/pages/sentences";
import { ResultPage } from "@/pages/result";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" errorElement={<ErrorComponent />} element={<Outlet />}>
            <Route
                element={
                    <ModalProvider>
                        <Sidebar />
                        <main className="main" id="main-container">
                            <Outlet />
                        </main>

                        <ToastContainer
                            position="top-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="light"
                        />
                        <Footer />
                    </ModalProvider>
                }>
                <Route index element={<MainPage />} />
                <Route path="text-book" element={<TextbookPage />} />

                <Route path="profile" element={<PrivateRoute />}>
                    <Route index element={<ProfilePage />} />
                    <Route path="statistics" element={<StatisticsPage />} />
                    <Route path="collection" element={<CollectionPage />} />
                </Route>

                <Route path="games">
                    <Route index element={<GamesPage />} />

                    <Route path={GameType.sprint}>
                        <Route
                            element={
                                <BlockBackground
                                    content={{
                                        title: gamesLabels[GameType.sprint].title,
                                        description: gamesLabels[GameType.sprint].description.main,
                                    }}
                                />
                            }>
                            <Route index element={<GameStartScreen type={GameType.sprint} />} />
                            <Route path="game" element={<GameDataManager />}>
                                <Route index element={<SprintPage />} />
                            </Route>
                        </Route>
                        <Route
                            element={
                                <BlockBackground
                                    content={{
                                        title: gamesLabels[GameType.sprint].title,
                                        description: "Practice complete",
                                    }}
                                />
                            }>
                            <Route path="result" element={<ResultPage type={GameType.sprint} />} />
                        </Route>
                    </Route>
                    <Route path={GameType.audiocall}>
                        <Route
                            element={
                                <BlockBackground
                                    content={{
                                        title: gamesLabels[GameType.audiocall].title,
                                        description: gamesLabels[GameType.audiocall].description.main,
                                    }}
                                />
                            }>
                            <Route index element={<GameStartScreen type={GameType.audiocall} />} />
                            <Route path="game" element={<GameDataManager />}>
                                <Route index element={<AudiocallPage />} />
                            </Route>
                        </Route>
                        <Route
                            element={
                                <BlockBackground
                                    content={{
                                        title: gamesLabels[GameType.audiocall].title,
                                        description: "Practice complete",
                                    }}
                                />
                            }>
                            <Route path="result" element={<ResultPage type={GameType.audiocall} />} />
                        </Route>
                    </Route>

                    <Route path={GameType.puzzles}>
                        <Route
                            element={
                                <BlockBackground
                                    content={{
                                        title: gamesLabels[GameType.puzzles].title,
                                        description: gamesLabels[GameType.puzzles].description.main,
                                    }}
                                />
                            }>
                            <Route index element={<GameStartScreen type={GameType.puzzles} />} />
                            <Route path="game" element={<GameDataManager />}>
                                <Route index element={<PuzzlePage />} />
                            </Route>
                        </Route>
                        <Route
                            element={
                                <BlockBackground
                                    content={{
                                        title: gamesLabels[GameType.puzzles].title,
                                        description: "Practice complete",
                                    }}
                                />
                            }>
                            <Route path="result" element={<ResultPage type={GameType.puzzles} />} />
                        </Route>
                    </Route>
                    <Route path={GameType.constructor}>
                        <Route
                            element={
                                <BlockBackground
                                    content={{
                                        title: gamesLabels[GameType.constructor].title,
                                        description: gamesLabels[GameType.constructor].description.main,
                                    }}
                                />
                            }>
                            <Route index element={<GameStartScreen type={GameType.constructor} />} />
                            <Route path="game" element={<GameDataManager />}>
                                <Route index element={<ConstructorPage />} />
                            </Route>
                        </Route>
                        <Route
                            element={
                                <BlockBackground
                                    content={{
                                        title: gamesLabels[GameType.constructor].title,
                                        description: "Practice complete",
                                    }}
                                />
                            }>
                            <Route path="result" element={<ResultPage type={GameType.constructor} />} />
                        </Route>
                    </Route>
                </Route>
                <Route path="*" element={<ErrorComponent error={{ code: 404, message: "Page not found" }} />} />
            </Route>
        </Route>,
    ),
);

export default router;
