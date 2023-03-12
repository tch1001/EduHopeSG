import { useState } from 'react';
import Container from "../components/Container";
import Link from 'next/link';
import styles from "../styles/login.module.css";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      <div className={styles.container}>
        <h1 className={styles.heading}>Login</h1>
        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.outerContainer}>
            <div className={styles.innerContainer}>
              <label htmlFor="email" className={styles.label}>Email address</label>
              <input type="email" className={styles.input} id="email" value={email} onChange={handleEmailChange} />
            </div>
            <div className={styles.innerContainer}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input type="password" className={styles.input} id="password" value={password} onChange={handlePasswordChange} />
            </div>
            <button type="submit" className={styles.button}>Login</button>
          </div>
        </form>
      </div>
      <p className={styles.text}>New to EduHope? 
        <Link href="/signup" passHref className={styles.link}>
          Join us Now
        </Link>
      </p>
    </Container>
  );
}

export default Login;
