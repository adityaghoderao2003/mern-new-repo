import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate("/login");
    }

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate("/login");
    }

    return (
        <nav>
            <h2>My App</h2>


            <Link to="/product">Products</Link>

            <Link to="/order">Orders</Link>

            <Link to="/review">Reviews</Link>

            {token && role === "admin" && (
                <>
                    <Link to="/addproduct">Manage Products</Link>
                </>
            )}

            {token ? (
                <button onClick={handleLogout}>
                    Logout
                </button>
            ) : (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    );
};

export default Navbar;