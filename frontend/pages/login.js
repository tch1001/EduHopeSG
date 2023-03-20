import { useState } from "react";
import Link from "next/link";
import Button from "../components/Button";
import Container from "../components/Container";
import Card from "../components/Card";
import styles from "../styles/login.module.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert("Please enter both an email and a password.");
            return;
        }

        // Check if the email is valid using a regular expression
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        // Check if the password is at least 6 characters long
        if (password.length < 6) {
            alert("Please enter a password that is at least 6 characters long.");
            return;
        }

        // If input is valid, you can submit the form data to a server for authentication.
    };


    return (
        <Container center className="p-6 max-w-5xl">
            <Card className="p-4 m-2">
                <span className="text-2xl font-bold block text-center my-2">Login</span>
                <form className="flex flex-col items-center gap-2" onSubmit={handleSubmit} noValidate autoComplete="off">
                    <div className="w-full max-w-sm px-4 py-2">
                        <label htmlFor="email">Email address</label>
                        <input
                            type="email"
                            id="email"
                            className={styles.input}
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </div>
                    <div className="w-full max-w-sm px-4 py-2">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className={styles.input}
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <Button type="submit">Login</Button>
                </form>
            </Card>
            <p>
                New to EduHope?{" "}
                <Link href="/signup" className="link" passHref>Join us Now</Link>
            </p>
        </Container>
    );
}

export default Login;
