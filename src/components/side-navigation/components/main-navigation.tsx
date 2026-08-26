import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { ScreenSize } from "../../../shared/types/interfaces";
import SignInControl from "./sign-in-control";
import SignOutControl from "./sign-out-control";
import { useAuth } from "@/features/auth/model/auth-provider";

const StyledNavigation = styled("ul")`
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
    padding: 0 1rem 1rem 1rem;
    font-size: 1.25rem;

    @media ${ScreenSize.TABLET} {
        flex-direction: column;
        padding: 1rem 0 1rem 1rem;
        font-size: 1rem;
    }

    .nav__title {
        display: none;

        @media ${ScreenSize.TABLET} {
            display: inline;
        }
    }
`;

const StyledNavigationSub = styled("ul")`
    display: none;

    @media ${ScreenSize.TABLET} {
        display: flex;
        justify-content: center;
        flex-direction: column;
        padding: 0.5rem 0 0.5rem 1rem;
        gap: 0.5rem;
        font-size: 0.8rem;
    }
`;

const StyledNavLink = styled(NavLink)<{ $type?: "SUB" }>`
    color: ${properties => (properties.$type === "SUB" ? "rgb(42, 157, 143)" : "white")};
    padding: 0.5rem;
    display: flex;
    gap: 1rem;
    align-items: center;

    &.active {
        border-radius: 0 0 0.5rem 0.5rem;
        background-color: ${properties => (properties.$type === "SUB" ? "rgb(42, 157, 143)" : "white")};
        color: ${properties => (properties.$type === "SUB" ? "white" : "rgb(231, 111, 81)")};

        @media ${ScreenSize.TABLET} {
            border-radius: 0.5rem 0 0 0.5rem;
        }
    }
`;

function MainNavigation() {
    const { user } = useAuth();

    return (
        <StyledNavigation>
            <li>
                <StyledNavLink to="/" title="Homepage">
                    <i className="fa-solid fa-house" />
                    <span className="nav__title">Homepage</span>
                </StyledNavLink>
            </li>
            <li>
                <StyledNavLink to="/text-book" title="Textbook">
                    <i className="fa-solid fa-book" />
                    <span className="nav__title">Textbook</span>
                </StyledNavLink>
            </li>
            <li>
                <StyledNavLink to="/games" title="Games">
                    <i className="fa-solid fa-puzzle-piece" />
                    <span className="nav__title">Games</span>
                </StyledNavLink>
                <StyledNavigationSub>
                    <li>
                        <StyledNavLink to="/games/sprint" title="Sprint" $type="SUB">
                            <i className="fa-solid fa-stopwatch" />
                            <span className="nav__title">Sprint</span>
                        </StyledNavLink>
                    </li>
                    <li>
                        <StyledNavLink to="/games/constructor" title="Constructor" $type="SUB">
                            <i className="fa-solid fa-ellipsis" />
                            <span className="nav__title">Constructor</span>
                        </StyledNavLink>
                    </li>
                    <li>
                        <StyledNavLink to="/games/audiocall" title="Audiocall" $type="SUB">
                            <i className="fa-solid fa-music" />
                            <span className="nav__title">Audiocall</span>
                        </StyledNavLink>
                    </li>
                    <li>
                        <StyledNavLink to="/games/puzzles" title="Puzzles" $type="SUB">
                            <i className="fa-solid fa-puzzle-piece" />
                            <span className="nav__title">Puzzles</span>
                        </StyledNavLink>
                    </li>
                </StyledNavigationSub>
            </li>

            <li>
                {user ? (
                    <>
                        <StyledNavLink to="/profile" title="Profile">
                            <i className="fa-solid fa-user" />
                            <span className="nav__title">Profile</span>
                        </StyledNavLink>

                        <StyledNavigationSub>
                            <li>
                                <StyledNavLink to="/profile/collection" title="Collection" $type="SUB">
                                    <i className="fa-regular fa-folder" />
                                    <span className="nav__title">Collection</span>
                                </StyledNavLink>
                            </li>
                            <li>
                                <StyledNavLink to="/profile/statistics" title="Statistics" $type="SUB">
                                    <i className="fa-solid fa-table" />
                                    <span className="nav__title">Statistics</span>
                                </StyledNavLink>
                            </li>
                        </StyledNavigationSub>
                        <SignOutControl />
                    </>
                ) : (
                    <SignInControl />
                )}
            </li>
        </StyledNavigation>
    );
}

export default MainNavigation;
