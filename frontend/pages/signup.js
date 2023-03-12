import React, { useState } from 'react';
import Container from "../components/Container";
import styles from "../styles/signup.module.css";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [highestEducation, setHighestEducation] = useState('');
  const [currentEducation, setCurrentEducation] = useState('');
  const [schoolName, setSchoolName] = useState('');

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      highestEducation,
      currentEducation,
      schoolName
    });
  };

  switch(step) {
    case 1:
      return (
        <Container center className="p-6 max-w-5xl">
          <div className={styles.container}>
            <h1 className={styles.heading}>Sign Up</h1>
            <h2 className={styles.subHeading}>Step 1</h2>
            <form onSubmit={nextStep} className={styles.form} noValidate>
              <div className={styles.innerContainer}>
                <label className={styles.label}>First Name:</label>
                <input className={styles.input} value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
              </div>
              <div className={styles.innerContainer}>
                <label className={styles.label}>Last Name:</label>
                <input className={styles.input} value={lastName} onChange={(e) => setLastName(e.target.value)}/>
              </div>
              <div className={styles.innerContainer}>
                <label className={styles.label}>Email Address:</label>
                <input className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)}/>
              </div>
              <div className={styles.buttonContainer}>
                <button type="button" onClick={nextStep} className={styles.buttonRight}>Next</button>
              </div>
            </form>
          </div>
        </Container>
      );
    case 2:
      return (
        <Container center className="p-6 max-w-5xl">
          <div className={styles.container}>
            <h1 className={styles.heading}>Sign Up</h1>
            <h2 className={styles.subHeading}>Step 2</h2>
            <form onSubmit={nextStep} className={styles.form} noValidate>
              <div className={styles.innerContainer}>
                <label className={styles.label}>Password:</label>
                <input className={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
              </div>
              <div className={styles.innerContainer}>
                <label className={styles.label}>Confirm Password:</label>
                <input className={styles.input} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
              </div>
              <div className={styles.buttonContainer}>
                <button type="button" onClick={prevStep} className={styles.buttonLeft}>Back</button>
                <button type="button" onClick={nextStep} className={styles.buttonRight}>Next</button>
              </div>
            </form>
          </div>
        </Container>
      );
    case 3:
      return (
        <Container center className="p-6 max-w-5xl">
          <div className={styles.container}>
            <h1 className={styles.heading}>Sign Up</h1>
            <h2 className={styles.subHeading}>Step 3</h2>
            <form onSubmit={onSubmit} className={styles.form} noValidate>
              <div className={styles.innerContainer}>
                <label className={styles.label}>Highest Education Level Obtained:</label>
                <select className={styles.input} value={highestEducation} onChange={(e) => setHighestEducation(e.target.value)}>
                  <option value="">--Select--</option>
                  <option value="highSchool">High School</option>
                  <option value="college">College</option>
                  <option value="graduateSchool">Graduate School</option>
                </select>
              </div>
              <div className={styles.innerContainer}>
                <label className={styles.label}>Current Education:</label>
                <select className={styles.input} value={currentEducation} onChange={(e) => setCurrentEducation(e.target.value)}>
                  <option value="">--Select--</option>
                  <option value="highSchool">High School</option>
                  <option value="college">College</option>
                  <option value="graduateSchool">Graduate School</option>
                </select>
              </div>
              <div className={styles.innerContainer}>
                <label className={styles.label}>Current School's Name:</label>
                <input className={styles.input} value={schoolName} onChange={(e) => setSchoolName(e.target.value)}/>
              </div>
              <div className={styles.buttonContainer}>
                <button type="button" onClick={prevStep} className={styles.buttonLeft}>Back</button>
                <button type="submit" className={styles.buttonRight}>Submit</button>
              </div>
            </form>
          </div>
        </Container>
      );
    default:
      return null;
  }
};

export default SignUp;
