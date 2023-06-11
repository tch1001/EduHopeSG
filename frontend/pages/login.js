import { useState } from "react";
import { useRouter } from 'next/router';
import { useFormik } from "formik";
import Link from "next/link";
import Button from "../components/Button";
import Container from "../components/Container";
import Card from "../components/Card";
import FormErrorDisplay from "../components/FormErrorDisplay";
import useUser from "../helpers/useUser";
import Yup from "../helpers/Yup";
import styles from "../styles/forms.module.css";

function Login() {

    const LoginSchema = Yup.object({
        email: Yup.string()
            .email("Invalid email address")
            .required("Required"),
        password: Yup.string().required("Required")
    });

    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const originalURL = router.query?.originalURL || "/"
    const [user, { login }] = useUser()

    if (user.id) router.push(originalURL)

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: LoginSchema,
        onSubmit: handleLogin
    });

    async function handleLogin(values) {
        if (loading) return;
        setLoading(true);

        try {
            await login(values);
            router.push(originalURL);
        } catch (err) {
            // TODO: use dialogue/toast component for notification
            // success and error messages
            alert(`${err.name}: ${err.message}. ${err.details}`)
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container center className="p-6 max-w-5xl">
            <Card className="p-4 m-2 shadow-md shadow-slate-300 min-w-full xs:min-w-xs">
                <span className="text-2xl font-bold block text-center my-2">Login</span>
                <form
                    className={styles.form}
                    onSubmit={formik.handleSubmit}
                    noValidate
                >
                    <div className="w-full max-w-sm px-4 py-2">
                        <FormErrorDisplay field="email" formik={formik} />
                        <input
                            type="email"
                            placeholder="Email address"
                            autoComplete="username"
                            {...formik.getFieldProps("email")}
                        />
                    </div>
                    <div className="w-full max-w-sm px-4 py-2">
                        <FormErrorDisplay field="password" formik={formik} />
                        <input
                            type="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            {...formik.getFieldProps("password")}
                        />
                    </div>
                    <Button type="submit" loading={loading}>Login</Button>
                </form>
            </Card>
            <p className="p-2">
                New to EduHope?{" "}
                <Link href={`/signup?originalURL=${originalURL}`} className="link" passHref>Join us Now</Link>
            </p>
        </Container>
    );
}

export default Login;