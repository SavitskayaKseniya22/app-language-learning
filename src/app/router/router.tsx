import { Route, Outlet, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sprint from "../../pages/sprint/sprint";
import Audiocall from "../../pages/audiocall/audiocall";
import { GameDifficultyType } from "../../shared/types/interfaces";
import GameResult from "../../pages/game/components/game-result";
import Puzzles from "../../pages/sentences/puzzles";
import ModalProvider from "../../shared/ui/modal/modal-provider";
import Collection from "../../pages/collection/collection";
import Profile from "../../pages/profile/profile";
import Games from "../../pages/games/games";
import PrivateRoute from "../../features/auth/ui/private-route";
import GameStartScreen, { GameInitialData } from "../../pages/game/components/game-start-screen";
import PuzzleResult from "../../pages/sentences/components/puzzle-result";
import Constructor from "../../pages/constructor/constructor";
import Statistics from "../../pages/statistics/statistics";
import { GameType } from "../api/user-api";
import { MainPage } from "@/pages/main";
import { TextbookPage } from "@/pages/textbook";
import { Sidebar } from "@/widgets/sidebar";
import { Footer } from "@/widgets/footer";
import ErrorComponent from "@/shared/ui/error-component/error-component";

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
                    <Route index element={<Profile />} />
                    <Route path="statistics" element={<Statistics />} />
                    <Route path="collection" element={<Collection />} />
                </Route>

                <Route path="games">
                    <Route index element={<Games />} />
                    <Route path="sprint" element={<GameInitialData />}>
                        <Route
                            index
                            element={<GameStartScreen value={GameDifficultyType.SPRINT} type={GameType.SPRINT} />}
                        />
                        <Route path="game" element={<Sprint />} />
                        <Route path="result" element={<GameResult type={GameType.sprint} />} />
                    </Route>

                    <Route path="puzzles" element={<GameInitialData />}>
                        <Route
                            index
                            element={<GameStartScreen value={GameDifficultyType.PUZZLES} type={GameType.PUZZLES} />}
                        />
                        <Route path="game" element={<Puzzles />} />
                        <Route path="result" element={<PuzzleResult />} />
                    </Route>

                    <Route path="audiocall" element={<GameInitialData />}>
                        <Route
                            index
                            element={<GameStartScreen value={GameDifficultyType.AUDIOCALL} type={GameType.AUDIOCALL} />}
                        />
                        <Route path="game" element={<Audiocall />} />
                        <Route path="result" element={<GameResult type={GameType.audiocall} />} />
                    </Route>

                    <Route path="constructor" element={<GameInitialData />}>
                        <Route
                            index
                            element={
                                <GameStartScreen value={GameDifficultyType.CONSTRUCTOR} type={GameType.CONSTRUCTOR} />
                            }
                        />
                        <Route path="game" element={<Constructor />} />
                        <Route path="result" element={<GameResult type={GameType.constructor} />} />
                    </Route>
                </Route>
                <Route path="*" element={<ErrorComponent error={{ code: 404, message: "Page not found" }} />} />
            </Route>
        </Route>,
    ),
);

export default router;
