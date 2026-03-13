/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAuth } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import './Navbar.css';
import logo from '../assets/react.svg';

const Navbar = () => {
    const { isAuthenticated,logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <>
            <nav className="nav-bar">
                <div className="nav-brand">
                    <img src={logo} alt="Logo" />
                    <h2>TommyDemo</h2>
                </div>
                
                <div className="nav-links">
                    {isAuthenticated && user?.role === "Admin" && (
                        <NavLink to="/admin" className="nav-link">
                            Admin Panel
                        </NavLink>
                    )}
                    {isAuthenticated && (
                        <button onClick={handleLogout} className="nav-button-logout">
                            Logout
                        </button>
                    )}
                    {!isAuthenticated && (
                        <>
                            <NavLink to="/" className="nav-link">
                                Login
                            </NavLink>
                            <NavLink to="/register" className="nav-button-register">
                                Register
                            </NavLink>
                        </>
                    )}
                </div>
            </nav>
        </>
    );
};

export default Navbar;