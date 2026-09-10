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
import Audiocall from "@/pages/audiocall/audiocall";
import Constructor from "@/pages/constructor/constructor";
import GameResult from "@/pages/game/components/game-result";
import GameStartScreen from "@/entities/game/ui/game-start-screen/game-start-screen";
import PuzzleResult from "@/pages/sentences/components/puzzle-result";
import Puzzles from "@/pages/sentences/puzzles";
import { GameDifficultyType } from "@/shared/types/interfaces";
import { ModalProvider } from "@/shared/ui/modal";
import { SprintPage } from "@/pages/sprint";
import { GameDataManager } from "@/entities/game";

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
                        <Route index element={<GameStartScreen type={GameType.sprint} />} />

                        <Route path="game" element={<GameDataManager />}>
                            <Route index element={<SprintPage />} />
                        </Route>

                        <Route path="result" element={<GameResult type={GameType.sprint} />} />
                    </Route>
                    <Route path={GameType.puzzles}>
                        <Route index element={<GameStartScreen type={GameType.puzzles} />} />

                        <Route path="game" element={<GameDataManager />}>
                            <Route index element={<SprintPage />} />
                        </Route>

                        <Route path="result" element={<GameResult type={GameType.puzzles} />} />
                    </Route>
                    <Route path={GameType.audiocall}>
                        <Route index element={<GameStartScreen type={GameType.audiocall} />} />

                        <Route path="game" element={<GameDataManager />}>
                            <Route index element={<SprintPage />} />
                        </Route>

                        <Route path="result" element={<GameResult type={GameType.audiocall} />} />
                    </Route>
                    <Route path={GameType.constructor}>
                        <Route index element={<GameStartScreen type={GameType.constructor} />} />

                        <Route path="game" element={<GameDataManager />}>
                            <Route index element={<SprintPage />} />
                        </Route>

                        <Route path="result" element={<GameResult type={GameType.constructor} />} />
                    </Route>
                </Route>
                <Route path="*" element={<ErrorComponent error={{ code: 404, message: "Page not found" }} />} />
            </Route>
        </Route>,
    ),
);

export default router;
