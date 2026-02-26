/* eslint-disable @typescript-eslint/no-explicit-any */
import { use, useState } from "react";
import './Login.css';

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string>("");


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError("");
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, name, email }),
            });

            if (!response.ok) {
                throw new Error("Something went wrong");
            }

            if (response.ok) {
                setError("Success!");
                setEmail("");
                setName("");
                setPassword("");
                setUsername("");
            }

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong");
            }
        }

    };

    return (
        <div className="loginBox">

            <form className="loginForm" onSubmit={handleSubmit}>
                {error && <p>{error}</p>}
                <label>Username</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} />
                <label>Password</label>
                <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} />
                <label>Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
                <label>Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} />
                <button>Register</button>
            </form>
        </div>
    );
};

export default Register;