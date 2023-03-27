import { useState } from "react";
import { useFormik } from "formik";
import Link from "next/link";
import Button from "../components/Button";
import Container from "../components/Container";
import Card from "../components/Card";
import FormErrorDisplay from "../components/FormErrorDisplay";
import useAxios from "../helpers/useAxios";
import Yup from "../helpers/Yup";
import styles from "../styles/forms.module.css";

const SignUp = () => {
  const SignupSchema = Yup.object({
    firstName: Yup.string()
      .min(3, "Given name has to be at least 3 characters")
      .max(35, "Given name is too long")
      .required("Required"),
    lastName: Yup.string()
      .min(2, "Family name has to be at least 2 characters")
      .max(35, "Family name too long")
      .required("Required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Required")
      .max(320, "Email address too long"),
    password: Yup.string()
      .required("Required")
      .password()
      .min(12, "Password has to be at least 12 characters"),
    confirmPassword: Yup.string()
      .required("Required")
      .password()
      .min(12, "Password has to be at least 12 characters")
      .test("test-match", "Passwords should match", (value, context) => {
        const { password } = context.parent;
        return password === value;
      }),
    school: Yup.string().required("Required"),
    // education_level: Yup.
  });

  const [loading, setLoading] = useState(false);
  const request = useAxios();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      school: "",

    },
    validationSchema: SignupSchema,
    onSubmit: () => { }
  });

  const steps = [
    <>
      <div className="w-full max-w-sm px-4 py-2">
        <FormErrorDisplay field="firstName" formik={formik} />
        <label htmlFor="firstName">Given name</label>
        <input
          id="firstName"
          className={styles.input}
          {...formik.getFieldProps("firstName")}
        />
      </div>
      <div className="w-full max-w-sm px-4 py-2">
        <FormErrorDisplay field="lastName" formik={formik} />
        <label htmlFor="lastName">Last name</label>
        <input
          id="lastName"
          className={styles.input}
          {...formik.getFieldProps("lastName")}
        />
      </div>
      <div className="w-full max-w-sm px-4 py-2">
        <FormErrorDisplay field="email" formik={formik} />
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          className={styles.input}
          {...formik.getFieldProps("email")}
        />
      </div>
    </>,
    <>
      <div className="w-full max-w-sm px-4 py-2">
        <FormErrorDisplay field="password" formik={formik} />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          className={styles.input}
          {...formik.getFieldProps("password")}
        />
      </div>
      <div className="w-full max-w-sm px-4 py-2">
        <FormErrorDisplay field="confirmPassword" formik={formik} />
        <label htmlFor="confirmPassword">Confirm password</label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          className={styles.input}
          {...formik.getFieldProps("confirmPassword")}
        />
      </div>
    </>,
    <>
      {/* <div className={styles.innerContainer}>
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
      </div> */}
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
