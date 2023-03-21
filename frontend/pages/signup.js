import React, { useState } from 'react';
import Link from "next/link";
import Button from "../components/Button";
import Container from "../components/Container";
import Card from "../components/Card";
import styles from "../styles/signup.module.css";

/**
 * Issues
 * 1. No validation for difference of "password" and "confirmPassword"
 * 2. 
 */

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [highestEducation, setHighestEducation] = useState('');
  const [currentEducation, setCurrentEducation] = useState('');
  const [schoolName, setSchoolName] = useState('');

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

  const steps = [
    <>
      <div className={styles.innerContainer}>
        <label className={styles.label}>First Name:</label>
        <input className={styles.input} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </div>
      <div className={styles.innerContainer}>
        <label className={styles.label}>Last Name:</label>
        <input className={styles.input} value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </div>
      <div className={styles.innerContainer}>
        <label className={styles.label}>Email Address:</label>
        <input className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
    </>,
    <>
      <div className={styles.innerContainer}>
        <label className={styles.label}>Password:</label>
        <input className={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className={styles.innerContainer}>
        <label className={styles.label}>Confirm Password:</label>
        <input className={styles.input} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      </div>
    </>,
    <>
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
        <input className={styles.input} value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
      </div>
    </>
  ];

  const [step, setStep] = useState(0);

  const checkNextStep = () => step + 1 >= steps.length;
  const checkPrevStep = () => step <= 0;

  const nextStep = () => {
    if (!checkNextStep) return;
    setStep(step + 1)
  }

  const prevStep = () => {
    if (!checkPrevStep) return;
    setStep(step - 1);
  }

  return (
    <Container center className="p-6 max-w-5xl">
      <div className={styles.container}>
        <div className="my-2">
          <span className="text-2xl font-bold block text-center">Sign Up</span>
          <span className="text-base block text-center">Step {step + 1} of {steps.length}</span>
        </div>
        <form className={styles.form} noValidate onSubmit={(e) => e.preventDefault()}>
          {steps[step]}
          <div className="flex flex-row gap-2">
            <Button disabled={checkPrevStep()} onClick={prevStep}>Back</Button>
            <Button disabled={checkNextStep()} onClick={nextStep}>Next</Button>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default SignUp;
