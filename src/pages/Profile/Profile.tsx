import { Link } from "react-router-dom";
import { StyledGameList, StyledGameItem } from "../games/games";

function Profile() {
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
        </main>
    );
}

export default Profile;
