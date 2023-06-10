import { useEffect, useState} from "react";
import { useRouter } from 'next/router'
import { useFormik } from "formik";
import Link from "next/link";
import Button from "../components/Button";
import Container from "../components/Container";
import Card from "../components/Card";
import FormErrorDisplay from "../components/FormErrorDisplay";

import useAxios from "../helpers/useAxios";
import Yup from "../helpers/Yup";

import styles from "../styles/forms.module.css";

const EDUCATION_TYPES = [
    "Lower Primary",
    "Upper Primary",
    "Secondary 1",
    "Secondary 2",
    "Secondary 3",
    "Secondary 4",
    "Secondary 5",
    "JC 1",
    "JC 2",
    "O level Private candidate",
    "A level Private candidate",
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
    const router = useRouter()
    const originalURL = router.query?.originalURL

    const [loading, setLoading] = useState(false);
    const [schools, setSchools] = useState([]);
    const request = useAxios();

    const SignupSchema = Yup.object({
        firstName: Yup.string()
            .min(3, "Given name has to be at least 3 characters")
            .max(35, "Given name is too long")
            .matches(/^[A-Z][a-z]*$/, "Capitalise the first letter only")
            .required("Required"),
        lastName: Yup.string()
            .min(2, "Family name has to be at least 2 characters")
            .max(35, "Family name too long")
            .matches(/^[A-Z][a-z]*$/, "Capitalise the first letter only")
            .required("Required"),
        school: Yup.string().required("Required"),
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
        telegram: Yup.string()
            .required("Required")
            .min(5, "Telegram handles must have at least 5 characters")
            .max(32, "Telegram handles can have at most 32 characters")
            .matches(/^[a-zA-Z0-9_]*$/, "Can only contain alphanumeric characters and underscores (_)"),
        levelOfEducation: Yup.string().required("Required"),
        bio: Yup.string()
            .max(500, "Maximum of 500 characters")
            .optional(),
        referral: Yup.string().optional(),
        terms: Yup.boolean().isTrue("Agree to terms").required("Required"),
        guidelines: Yup.boolean().isTrue("Agree to guidelines").required("Required")
    });


    const formik = useFormik({
        validationSchema: SignupSchema,
        onSubmit: handleSignup,
        initialValues: {
            firstName: "",
            lastName: "",
            school: "",
            email: "",
            password: "",
            confirmPassword: "",
            telegramHandle: "",
            levelOfEducation: "",
            bio: "",
            referral: "",
            terms: false,
            guidelines: false
        },
    });

    useEffect(() => {
        request({
            method: "get",
            path: "/school"
        })
            .then(({ result }) => setSchools(result.map(({ name }) => name)))
            .catch(err => console.error(err));

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
                name: [firstName, lastName].join(" "),
                level_of_education: levelOfEducation,
                telegram,
                email,
                password,
                school,
                bio,
                referral
            }

            const response = await request({
                method: "post",
                path: "/user",
                data
            });

            console.log(response);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const steps = [
        <>
            <div className="w-full max-w-sm px-4 py-2">
                <FormErrorDisplay field="firstName" formik={formik} />
                <label htmlFor="firstName">Given name</label>
                <input id="firstName" {...formik.getFieldProps("firstName")} />
            </div>
            <div className="w-full max-w-sm px-4 py-2">
                <FormErrorDisplay field="lastName" formik={formik} />
                <label htmlFor="lastName">Last name</label>
                <input id="lastName" {...formik.getFieldProps("lastName")} />
            </div>
            <div className="w-full max-w-sm px-4 py-2">
                <FormErrorDisplay field="school" formik={formik} />
                <label htmlFor="school">School</label>
                <select id="school" {...formik.getFieldProps("school")}>
                    <option>--Select--</option>
                    <option>Graduated</option>
                    <option>In National Service</option>
                    {schools.map((school, i) => (
                        <option key={i}>{school}</option>
                    ))}
                </select>
            </div>
            <div className="w-full max-w-sm px-4 py-2">
                <FormErrorDisplay field="levelOfEducation" formik={formik} />
                <label htmlFor="levelOfEducation">Current level of education</label>
                <select id="levelOfEducation" {...formik.getFieldProps("levelOfEducation")}>
                    <option>--Select--</option>
                    {EDUCATION_TYPES.map((level, i) => (
                        <option key={i}>{level}</option>
                    ))}
                </select>
            </div>
            </>,
            <>
            <div className="w-full max-w-sm px-4 py-2">
                <FormErrorDisplay field="telegram" formik={formik} />
                <label htmlFor="telegram">Telegram Handle</label>
                <div>
                <span className={styles.slotItem}>@</span>
                <input
                    id="telegram"
                    className={styles.slot}
                    {...formik.getFieldProps("telegram")}
                />
                </div>
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
            <div className="w-full max-w-sm px-4 py-2">
                <FormErrorDisplay field="bio" formik={formik} />
                <label htmlFor="bio">Biography</label>
                <textarea
                    {...formik.getFieldProps("bio")}
                    placeholder="Give a short biography of yourself (max 500 characters)" 
                />
            </div>
            <div className="w-full max-w-sm px-4 py-2">
                <FormErrorDisplay field="referral" formik={formik} />
                <label htmlFor="referral">Referral</label>
                <select id="referral" {...formik.getFieldProps("referral")}>
                        <option>--Select--</option>
                        {REFERRALS.map((referral, i) => (
                            <option key={i}>{referral}</option>
                        ))}
                </select>
            </div>
            <div className="w-full max-w-sm px-4 py-2">
                <FormErrorDisplay field="terms" formik={formik} />
                <label htmlFor="terms">
                    I have read the{" "}
                    <Link href="/terms" passHref className="link">Terms and Conditions</Link>
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
                    <Link href="/guidelines/tutee" passHref className="link">Tutee Guidelines</Link>
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
            <Card className="p-4 m-2 shadow-md shadow-slate-300 sm:min-w-xs">
                <div className="my-2">
                    <span className="text-2xl font-bold block text-center">Sign Up</span>
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
                                    onClick={formik.handleSubmit}
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
                Already have an account with us?{" "}
                <Link href={`/login?originalURL=${originalURL}`} className="link" passHref>Login in here</Link>
            </p>
        </Container>
    );
};

export default SignUp;
