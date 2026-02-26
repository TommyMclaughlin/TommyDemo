import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../context/AuthContext";
import Admin from "../pages/Admin";

export default function Router() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Login />} />

                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute requiredRole="Admin">
                                <Admin />
                            </ProtectedRoute>
                        }
                    />
                    */
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}