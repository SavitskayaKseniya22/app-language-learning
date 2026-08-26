import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../model/auth-provider";

function PrivateRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return user ? <Outlet /> : <Navigate to="/" replace />;
}

export default PrivateRoute;
