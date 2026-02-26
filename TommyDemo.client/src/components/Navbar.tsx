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
                <img src={logo} />
                {isAuthenticated && user?.role === "Admin" && (
                    <NavLink to="/admin" className="button-bar">
                        Admin Panel
                    </NavLink>
                ) }
                {isAuthenticated && (
                    <button id="Logout" onClick={handleLogout} className="button-bar">Logout</button>
                )}
                {!isAuthenticated && (
                    <NavLink to="/" className="button-bar">Login</NavLink>
                )}
                {!isAuthenticated && (
                    <NavLink to="/register" className="button-bar">Register</NavLink>
                ) }
            </nav>
        </>
    );
};

export default Navbar;