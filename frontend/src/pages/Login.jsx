import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const passwordRef = useRef(null);

    const togglePassword = () => {
        // setShowPassword(!showPassword);
        if(passwordRef.current.type === 'text'){
            passwordRef.current.type = 'password'
        }else{
            passwordRef.current.type = 'text'
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:5000/api/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.user.role);

            alert(data.message);

            navigate("/product");
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <br /><br />

                <div>
                    <input
                        ref={passwordRef}
                        type='password'
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <button type="button" onClick={togglePassword}>
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>

                <br /><br />

                <button type="submit">
                    Login
                </button>
            </form>

            <br /><br />

            <div>
                <button onClick={() => navigate("/register")}>
                    Create Account
                </button>
            </div>
        </div>
    );
};

export default Login;