import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../model/use-auth";

export default function PrivateRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Загрузка…</div>;
    }

    return user ? <Outlet /> : <Navigate to="/" replace />;
}
