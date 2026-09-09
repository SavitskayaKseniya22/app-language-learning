import { Link } from "react-router-dom";

function Profile() {
    return (
        <main>
            <h2 className="main__title_main">Profile</h2>
            <div>
                <div>
                    <Link to="collection">
                        <h4>Collection</h4>
                    </Link>
                </div>
                <div>
                    <Link to="statistics">
                        <h4>Statistics</h4>
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default Profile;
