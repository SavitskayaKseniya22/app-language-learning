import React from 'react';
import {
  Route,
  Outlet,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ErrorPage, { ErrorType } from './pages/errorPage/ErrorPage';
import MainPage from './pages/mainPage/MainPage';
import TextBookPage from './pages/textBookPage/TextBookPage';
import Sprint from './pages/sprint/Sprint';
import Audiocall from './pages/audiocall/Audiocall';
import { GameDifficultyType, GameType, ResultType } from './interfaces';
import GameResult from './pages/game/components/GameResult';
import Puzzles from './pages/sentences/Puzzles';
import SidePanel from './components/sideNavigation/SidePanel';
import ModalProvider from './components/modal/ModalProvider';
import Collection from './pages/collection/Collection';
import GitHubLink from './components/sideNavigation/components/GitHubLink';
import Profile from './pages/Profile/Profile';
import Games from './pages/Games/Games';
import PrivateRoute from './components/PrivateRoute';
import GameStartScreen, {
  GameInitialData,
} from './pages/game/components/GameStartScreen';
import PuzzleResult from './pages/sentences/components/PuzzleResult';
import Constructor from './pages/constructor/Constructor';
import Statistics from './pages/statistics/Statistics';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      errorElement={<ErrorPage type={ErrorType.ERROR} />}
      id="root"
      element={<Outlet />}
    >
      <Route
        errorElement={<ErrorPage type={ErrorType.ERROR} />}
        element={
          <ModalProvider>
            <SidePanel />
            <Outlet />
            <GitHubLink />
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
          </ModalProvider>
        }
      >
        <Route index element={<MainPage />} />
        <Route
          path="/text-book"
          element={<TextBookPage />}
          errorElement={<ErrorPage type={ErrorType.ERROR} />}
        />

        <Route
          path="/profile"
          element={<PrivateRoute />}
          errorElement={<ErrorPage type={ErrorType.ERROR} />}
        >
          <Route index element={<Profile />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="collection" element={<Collection />} />
        </Route>

        <Route
          path="/games"
          errorElement={<ErrorPage type={ErrorType.ERROR} />}
        >
          <Route index element={<Games />} />
          <Route path="sprint" element={<GameInitialData />}>
            <Route
              index
              element={
                <GameStartScreen
                  value={GameDifficultyType.SPRINT}
                  type={GameType.SPRINT}
                />
              }
            />
            <Route path="game" element={<Sprint />} />
            <Route
              path="result"
              element={<GameResult type={ResultType.sprint} />}
            />
          </Route>

          <Route path="puzzles" element={<GameInitialData />}>
            <Route
              index
              element={
                <GameStartScreen
                  value={GameDifficultyType.PUZZLES}
                  type={GameType.PUZZLES}
                />
              }
            />
            <Route path="game" element={<Puzzles />} />
            <Route path="result" element={<PuzzleResult />} />
          </Route>

          <Route path="audiocall" element={<GameInitialData />}>
            <Route
              index
              element={
                <GameStartScreen
                  value={GameDifficultyType.AUDIOCALL}
                  type={GameType.AUDIOCALL}
                />
              }
            />
            <Route path="game" element={<Audiocall />} />
            <Route
              path="result"
              element={<GameResult type={ResultType.audiocall} />}
            />
          </Route>

          <Route path="constructor" element={<GameInitialData />}>
            <Route
              index
              element={
                <GameStartScreen
                  value={GameDifficultyType.CONSTRUCTOR}
                  type={GameType.CONSTRUCTOR}
                />
              }
            />
            <Route path="game" element={<Constructor />} />
            <Route
              path="result"
              element={<GameResult type={ResultType.constructor} />}
            />
          </Route>
        </Route>
        <Route path="*" element={<ErrorPage type={ErrorType.PAGENOTFOUND} />} />
      </Route>
    </Route>
  )
);

export default router;
