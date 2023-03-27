import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import Button from "../components/Button";
import Container from "../components/Container";
import Card from "../components/Card";
import FormErrorDisplay from "../components/FormErrorDisplay";
import useAxios from "../helpers/useAxios";
import styles from "../styles/signup.module.css";

/**
 * Issues
 * 1. No validation for difference of "password" and "confirmPassword"
 * 2. 
 */

const SignUp = () => {
  // const []
  // const [firstName, setFirstName] = useState('');
  // const [lastName, setLastName] = useState('');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');
  // const [highestEducation, setHighestEducation] = useState('');
  // const [currentEducation, setCurrentEducation] = useState('');
  // const [schoolName, setSchoolName] = useState('');

  // const onSubmit = (e) => {
  //   e.preventDefault();
  //   console.log({
  //     firstName,
  //     lastName,
  //     email,
  //     password,
  //     confirmPassword,
  //     highestEducation,
  //     currentEducation,
  //     schoolName
  //   });
  // };

  const SignupSchema = Yup.object({
    given_name: Yup.string()
      .min(3, "Given name has to be at least 3 characters")
      .max(35, "Given name is too long")
      .required("Required"),
    family_name: Yup.string()
      .min(2, "Family name has to be at least 2 characters")
      .max(35, "Family name too long")
      .required("Required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Required")
      .max(320, "Email address too long"),
    password: Yup.string()
      .min(12, "Password has to be at least 12 characters")
      .required("Required"),
    confirmPassword: Yup.string(), // todo: test if they match
    school: Yup.string().required("Required"),
    // education_level: Yup.
  });

  const [loading, setLoading] = useState(false);
  const request = useAxios();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: LoginSchema,
    onSubmit: handleLogin
  });

  const steps = [
    <>
      <div className="w-full max-w-sm px-4 py-2">
        <FormErrorDisplay field="first-name" formik={formik} />
        <label htmlFor="first-name">Given name</label>
        <input
          type="email"
          id="first-name"
          className={styles.input}
          {...formik.getFieldProps("first-name")}
        />
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
      <Card className="p-4 m-2 shadow-md shadow-slate-300">
        <div className="my-2">
          <span className="text-2xl font-bold block text-center">Sign Up</span>
          <span className="text-base block text-center">Step {step + 1} of {steps.length}</span>
        </div>
        <form
          className="flex flex-col items-center gap-2"
          onSubmit={e => e.preventDefault()}
          noValidate
        >
          {steps[step]}
          <div className="flex flex-row gap-2">
            <Button disabled={checkPrevStep()} onClick={prevStep}>Back</Button>
            <Button disabled={checkNextStep()} onClick={nextStep}>Next</Button>
          </div>
        </form>
      </Card>
      <p>
        Already have an account with us?{" "}
        <Link href="/login" className="link" passHref>Login in here</Link>
      </p>
    </Container>
  );
};

export default SignUp;
