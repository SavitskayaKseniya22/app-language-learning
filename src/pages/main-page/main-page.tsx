import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";
import { NavArrow } from "./component/nav-arrow";
import { ScreenSize } from "../../interfaces";

const StyledMainPageBlock = styled("ul")`
    min-height: 100vh;
    width: 100%;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2rem;

    @media ${ScreenSize.LAPTOPS} {
        padding: 2rem;
    }

    .main-page__link {
        color: rgb(42, 157, 143);
    }
`;

function MainPage() {
    return (
        <main className="main">
            <NavArrow />
            <StyledMainPageBlock id="section-0">
                <h1>Awesome language learning app</h1>
                <a className="main-page__link" href="#section-1">
                    Learn English by playing games
                </a>
            </StyledMainPageBlock>
            <StyledMainPageBlock id="section-1">
                <li>
                    <NavLink to="/games/audiocall">
                        <h2>Audio Challenge</h2>
                        <p>Train your ears as well as your eyes to recognise english speech!</p>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/games/puzzles">
                        <h2>Puzzles</h2>
                        <p>Make puzzles from a set of words. Score more points in the given time.</p>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/games/constructor">
                        <h2>Word constructor</h2>
                        <p>Improve your spelling!</p>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/games/sprint">
                        <h2>Sprint</h2>
                        <p>Challenge your wit and knowledge in a fast paced and rewarding guessing game!</p>
                    </NavLink>
                </li>
            </StyledMainPageBlock>
            <StyledMainPageBlock id="section-2">
                <li>
                    <h3>
                        Use
                        <Link to="/text-book" className="main-page__link">
                            {" "}
                            the Textbook{" "}
                        </Link>
                        to understand the meaning of the word
                    </h3>
                    <p>
                        3600 of the most commonly used english words are organised in 6 sections for a convenient and
                        measured learning experience. Don&apos;t hesitate to mark words as &quot;difficult&quot; or
                        &quot;learned&quot; to better track your progress!
                    </p>
                </li>
                <li>
                    <h3>
                        Collect words into
                        <Link to="/profile/collection" className="main-page__link">
                            {" "}
                            Сollection{" "}
                        </Link>
                        for practice
                    </h3>
                    <p>
                        A set of selected words for individual training in games. Available only for authorized users.
                    </p>
                </li>
                <li>
                    <h3>
                        Track your progress in
                        <Link to="/profile/statistics" className="main-page__link">
                            {" "}
                            Statistics
                        </Link>
                    </h3>
                    <p>
                        Your progress is monitored and logged. Be sure to take a look at it once in a while to make sure
                        you are on track! Available only for authorized users.
                    </p>
                </li>
            </StyledMainPageBlock>
        </main>
    );
}

export default MainPage;
