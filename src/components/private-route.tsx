import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/store";

function PrivateRoute() {
    const { user } = useAppSelector(state => state.persist.auth);
    return user ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute;
