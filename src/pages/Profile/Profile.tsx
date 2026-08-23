import React from "react";
import { Link } from "react-router-dom";

import { useAppDispatch } from "../../store/store";
import { resetUser } from "../../store/auth/authSlice";
import { StyledGameList, StyledGameItem } from "../Games/Games";

function Profile() {
    const dispatch = useAppDispatch();

    return (
        <main>
            <h2 className="main__title_main">Profile</h2>
            <StyledGameList>
                <StyledGameItem>
                    <Link to="collection">
                        <h4>Collection</h4>
                    </Link>
                </StyledGameItem>
                <StyledGameItem>
                    <Link to="statistics">
                        <h4>Statistics</h4>
                    </Link>
                </StyledGameItem>
            </StyledGameList>
            <button
                type="button"
                onClick={() => {
                    dispatch(resetUser());
                }}>
                Sign Out
            </button>
        </main>
    );
}

export default Profile;
