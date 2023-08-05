import { useState, useContext } from "react";
import { useRouter } from 'next/router';
import { useFormik } from "formik";
import Link from "next/link";
import Button from "../components/Button";
import Container from "../components/Container";
import Card from "../components/Card";
import FormErrorDisplay from "../components/FormErrorDisplay";

import { dialogSettingsContext } from "../helpers/dialogContext";
import useUser from "../helpers/useUser";
import Yup from "../helpers/Yup";

import styles from "../styles/forms.module.css";

function Login() {
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const originalURL = router.query?.originalURL || "/"
    
    const [user, { login }] = useUser(); 
    if (user.id) router.push(originalURL);

    const { dialogSettings, setDialogSettings, closeDialog, displayErrorDialog } = useContext(dialogSettingsContext);

    const LoginSchema = Yup.object({
        email: Yup.string()
            .default("")
            .email("Invalid email address")
            .required("Required"),
        password: Yup.string()
            .default("")
            .required("Required")
    });

    const formik = useFormik({
        validationSchema: LoginSchema,
        initialValues: LoginSchema.default(),
        onSubmit: handleLogin
    });

    async function handleLogin(values) {
        if (loading) return;
        setLoading(true);

        try {
            const user = await login(values);

            if (user.is_tutor) {
                window.location.href = "/manage-tutees";
            } else {
                window.location.href = originalURL;
            }

        } catch (err) {
            displayErrorDialog(err);
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
            <p className="p-2 text-center">
                New to EduHope?{" "}
                <Link href={`/signup?originalURL=${originalURL}`} className="link whitespace-nowrap" passHref>Create an account!</Link>
            </p>
            <p className="p-2 text-center">
                Forgot your password?{" "}
                <Link href={`/forgot-password?originalURL=${originalURL}`} className="link whitespace-nowrap" passHref>Reset password</Link>
            </p>            
        </Container>
    );
}

export default Login;