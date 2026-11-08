import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {

    const [formdata, setFormdata] = useState({
        name: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormdata({
            ...formdata,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formdata)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            alert(data.message);

            navigate("/login");

        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <>
            <h2>Register</h2>

            <input
                type="text"
                name="name"
                placeholder="Name"
                value={formdata.name}
                onChange={handleChange}
            />

            <br /><br />

            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formdata.email}
                onChange={handleChange}
            />

            <br /><br />

            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formdata.password}
                onChange={handleChange}
            />

            <br /><br />

            <button onClick={handleRegister}>
                Register
            </button>

            <br /><br />

            <button onClick={() => navigate("/login")}>
                Already have an account? Login
            </button>
        </>
    );
};

export default Register;