import { useEffect, useState, useContext } from "react";
import { useRouter } from 'next/router'
import { useFormik } from "formik";
import Link from "next/link";
import Button from "../../components/Button";
import Container from "../../components/Container";
import Card from "../../components/Card";
import FormErrorDisplay from "../../components/FormErrorDisplay";

import { dialogSettingsContext } from "../../helpers/dialogContext";
import useAxios from "../../helpers/useAxios";
import Yup from "../../helpers/Yup";

import styles from "../../styles/forms.module.css";
import useUser from "../../helpers/useUser";

const EDUCATION_TYPES = [
    'SEC_1',
    'SEC_2',
    'SEC_3',
    'SEC_4',
    'SEC_5',
    'JC_1',
    'JC_2',
    'PRIVATE_O_LEVEL',
    'PRIVATE_A_LEVEL',
    'IP_1',
    'IP_2',
    'IP_3',
    'IP_4',
    'IP_5',
    'IP_6',
    'IB_1',
    'IB_2',
    'POLYTECHNIC_0',
    'POLYTECHNIC_1',
    'POLYTECHNIC_2',
    'POLYTECHNIC_3',
    'UNI_UNDERGRADUATE',
    'UNI_GRADUATE'
]

const REFERRALS = [
    "Reddit",
    "Instagram",
    "TikTok",
    "Telegram",
    "Word of mouth",
    "Online search"
]

const SignUp = () => {
    const [loading, setLoading] = useState(false);
    const [schools, setSchools] = useState([]);

    const [user, { login }] = useUser();
    const request = useAxios();

    const router = useRouter();
    const originalURL = router.query?.originalURL || "/"

    if (user.id) router.push(originalURL);

    const { dialogSettings, setDialogSettings, closeDialog, displayErrorDialog } = useContext(dialogSettingsContext);

    const SignupSchema = Yup.object({
        firstName: Yup.string()
            .default("")
            .min(2, "Given name has to be at least 2 characters long")
            .max(35, "Given name is too long")
            .matches(/^[A-Z][a-z]*$/, "Capitalise the first letter only")
            .required("Required"),
        lastName: Yup.string()
            .default("")
            .min(1, "Family name has to be at least 1 character long")
            .max(35, "Family name too long")
            .matches(/^[A-Z][a-z]*$/, "Capitalise the first letter only")
            .required("Required"),
        school: Yup.string()
            .default("")
            .required("Required")
            .test("requirement-check", "Required", (value) => value !== "--Select your school--"),
        email: Yup.string()
            .default("")
            .email("Invalid email address")
            .required("Required")
            .max(320, "Email address too long"),
        password: Yup.string()
            .default("")
            .required("Required")
            .password()
            .min(12, "Password has to be at least 12 characters long"),
        confirmPassword: Yup.string()
            .default("")
            .required("Required")
            .password()
            .min(12, "Password has to be at least 12 characters long")
            .test("test-match", "Passwords should match", (value, context) => {
                const { password } = context.parent;
                return password === value;
            }),
        telegram: Yup.string()
            .default("")
            .required("Required")
            .min(5, "Telegram handles must have at least 5 characters")
            .max(32, "Telegram handles can have at most 32 characters")
            .matches(/^[a-zA-Z0-9_]*$/, "Can only contain alphanumeric characters and underscores (_)"),
        levelOfEducation: Yup
            .string()
            .default("")
            .required("Required")
            .test("requirement-check", "Required", (value) => value !== "--Current education level of education--"),
        bio: Yup.string()
            .default("")
            .max(500, "Maximum of 500 characters")
            .optional(),
        referral: Yup
            .string()
            .default("")
            .optional()
            .test("requirement-check", "Required", (value) => value !== "--How did you hear about us?--"),
        terms: Yup.boolean().default(false).isTrue("Agree to terms").required("Required"),
        guidelines: Yup.boolean().default(false).isTrue("Agree to guidelines").required("Required")
    });


    const formik = useFormik({
        validationSchema: SignupSchema,
        onSubmit: handleSignup,
        initialValues: SignupSchema.default(),
    });

    useEffect(() => {
        request({
            method: "get",
            path: "/school"
        })
            .then(({ result }) => setSchools(result.map(({ name }) => name)))
            .catch(err => displayErrorDialog(err));

        // get education levels and referrals from server?
    }, [])

    async function handleSignup({
        firstName,
        lastName,
        email,
        password,
        school,
        levelOfEducation,
        telegram,
        bio,
        referral
    }) {
        if (loading) return;
        setLoading(true);

        try {
            const data = {
                given_name: firstName,
                family_name: lastName,
                level_of_education: levelOfEducation,
                telegram,
                email,
                password,
                school,
                bio,
                referral
            }

            await request({
                method: "post",
                path: "/user",
                data
            });

            await login({ email, password });
            window.location.href = originalURL || "/";
        } catch (err) {
            displayErrorDialog(err);
        } finally {
            setLoading(false);
        }
    }

    const steps = [
        <>
            <div className="w-full max-w-sm px-4 py-2">
                <FormErrorDisplay field="firstName" formik={formik} />

                <input placeholder="Given name" {...formik.getFieldProps("firstName")} />
            </div>
            <div className="w-full max-w-sm px-4 py-2">
                <FormErrorDisplay field="lastName" formik={formik} />
                <input placeholder="Last name" {...formik.getFieldProps("lastName")} />
            </div>
            <div className="w-full max-w-sm px-4 py-2">
                <FormErrorDisplay field="school" formik={formik} />
                <select {...formik.getFieldProps("school")}>
                    <option>--Select your school--</option>
                    <option>Graduated</option>
                    <option>In National Service</option>
                    {schools.map((school, i) => (
                        <option key={i}>{school}</option>
                    ))}
                </select>
            </div>
            <div className="w-full max-w-sm px-4 py-2">
                <FormErrorDisplay field="levelOfEducation" formik={formik} />
                <select {...formik.getFieldProps("levelOfEducation")}>
                    <option>--Current education level of education--</option>
                    {EDUCATION_TYPES.map((level, i) => (
                        <option key={i}>{level}</option>
                    ))}
                </select>
            </div>
        </>,
        <>
            <div className="w-full max-w-sm px-4 py-2">
                <FormErrorDisplay field="telegram" formik={formik} />
                <div>
                    <span className={styles.slotItem}>@</span>
                    <input
                        placeholder="Telegram Handle"
                        className={styles.slot}
                        {...formik.getFieldProps("telegram")}
                    />
                </div>
            </div>
            <div className="w-full max-w-sm px-4 py-2">
                <FormErrorDisplay field="email" formik={formik} />
                <input
                    id="email"
                    type="email"
                    placeholder="Email address"
                    className={styles.input}
                    {...formik.getFieldProps("email")}
                />
            </div>
            <div className="w-full max-w-sm px-4 py-2">
                <FormErrorDisplay field="password" formik={formik} />
                <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Password"
                    className={styles.input}
                    {...formik.getFieldProps("password")}
                />
            </div>
            <div className="w-full max-w-sm px-4 py-2">
                <FormErrorDisplay field="confirmPassword" formik={formik} />
                <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Confirm password"
                    className={styles.input}
                    {...formik.getFieldProps("confirmPassword")}
                />
            </div>
        </>,
        <>
            <div className="w-full max-w-sm px-4 py-2">
                <FormErrorDisplay field="bio" formik={formik} />
                <textarea
                    {...formik.getFieldProps("bio")}
                    placeholder="Give a short biography of yourself (max 500 characters)"
                />
            </div>
            <div className="w-full max-w-sm px-4 py-2">
                <FormErrorDisplay field="referral" formik={formik} />
                <select id="referral" {...formik.getFieldProps("referral")}>
                    <option>--How did you hear about us?--</option>
                    {REFERRALS.map((referral, i) => (
                        <option key={i}>{referral}</option>
                    ))}
                </select>
            </div>
            <div className="w-full max-w-sm px-4 py-2">
                <FormErrorDisplay field="terms" formik={formik} />
                <label htmlFor="terms">
                    I have read the{" "}
                    <Link href="/terms" passHref className="link" rel="noopener noreferrer" target="_blank">Terms and Conditions</Link>
                </label>
                <input
                    id="terms"
                    type="checkbox"
                    className="float-right"
                    {...formik.getFieldProps("terms")}
                />
            </div>
            <div className="w-full max-w-sm px-4 py-2">
                <FormErrorDisplay field="guidelines" formik={formik} />
                <label htmlFor="guidelines">
                    I have read the{" "}
                    <Link href="/guidelines/tutee" passHref className="link" rel="noopener noreferrer" target="_blank">Tutee Guidelines</Link>
                </label>
                <input
                    id="guidelines"
                    type="checkbox"
                    className="float-right"
                    {...formik.getFieldProps("guidelines")}
                />
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
            <Card className="p-4 m-2 shadow-md shadow-slate-300 min-w-full xs:min-w-xs">
                <div className="my-2">
                    <span className="text-2xl font-bold block text-center">Sign Up (Tutee)</span>
                    <span className="text-base block text-center">Step {step + 1} of {steps.length}</span>
                </div>
                <form
                    className={styles.form}
                    onSubmit={(e) => e.preventDefault()}
                    noValidate
                >
                    {steps[step]}
                    <div className="flex flex-row gap-2">
                        <Button disabled={checkPrevStep()} onClick={prevStep}>Back</Button>

                        {
                            checkNextStep() ? (
                                <Button
                                    type="submit"
                                    onClick={() => {
                                        if (!Object.keys(formik.errors).length) {
                                            formik.handleSubmit()
                                        } else {
                                            formik.setTouched(Object.fromEntries(Object.keys(formik.values).map(field => [field, true])))
                                            displayErrorDialog({
                                                name: "Missing/Invalid Field Value(s)".toUpperCase(),
                                                message: "One or more fields have missing or invalid values",
                                                details: "Please refer to the red error message above each field for more information"
                                            })
                                        }
                                    }}
                                    loading={loading}
                                >
                                    Sign up
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                >
                                    Next
                                </Button>
                            )
                        }
                    </div>
                </form>
            </Card>
            <p className="p-2">
                Already have a tutee account with us?{" "}
                <Link href={`/login?originalURL=${originalURL}`} className="link" passHref>Login in here</Link>
            </p>
            <p className="p-1">
                Sign up as a tutor?{" "}
                <Link href={`/signup/tutor?originalURL=${originalURL}`} className="link" passHref>Become a tutor</Link>
            </p>
        </Container>
    );
};

export default SignUp;
