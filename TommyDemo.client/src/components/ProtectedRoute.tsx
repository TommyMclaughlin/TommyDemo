/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";
interface ProtectedRouteProps {
    children: JSX.Element;
    requiredRole?: string; // optional role restriction
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) {
        // Optional: show a spinner while checking auth
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace/>;
    }

    if (requiredRole && user?.role !== requiredRole) {
        // Redirect to a “not authorized” page or home
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};


export default ProtectedRoute;