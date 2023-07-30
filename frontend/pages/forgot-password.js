import { useFormik } from "formik";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Container from "../components/Container";
import Button from "../components/Button";
import Card from "../components/Card";
import FormErrorDisplay from "../components/FormErrorDisplay";

import { dialogSettingsContext } from "../helpers/dialogContext";
import useAxios from "../helpers/useAxios"
import useUser from "../helpers/useUser"
import Yup from "../helpers/Yup";

import styles from "../styles/forms.module.css";

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);

    const { setDialogSettings, closeDialog, displayErrorDialog } = useContext(dialogSettingsContext)

    const request = useAxios();

    const router = useRouter()
    const originalURL = router.query?.originalURL || "/"

    const requestResetPasswordSchema = Yup.object({
        email: Yup.string()
            .default("")
            .email("Invalid email address")
            .required("Required")
            .max(320, "Email address too long"),
    })
    async function handleRequestResetPassword({
        email
    }) {
        if (loading) return;
        setLoading(true);

        try {
            const response = await request({
                method: "get",
                path: `/user/reset-password?email=${email}&originalURL=${originalURL}`
            });

            setDialogSettings({
                title: 'Reset Password Link Sent!',
                message: "An email with the reset password link has been sent to your email. It expires in 10 minutes.",
                display: true,
                buttons: [{ text: "Close", bg: "bg-aqua", callback: closeDialog }],
            });

        } catch (err) {
            displayErrorDialog(err);
        } finally {
            setLoading(false);
        }
    }
    const requestResetPasswordFormik = useFormik({
        validationSchema: requestResetPasswordSchema,
        onSubmit: handleRequestResetPassword,
        initialValues: requestResetPasswordSchema.default()
    })


    return (
        <Container center className="p-6 max-w-5xl">
            <Card className="p-4 m-2 shadow-md shadow-slate-300 sm:min-w-xs">
                <form
                    className={styles.form}
                    onSubmit={(e) => e.preventDefault()}
                    noValidate
                >
                    <h2 className="font-bold text-xl">Reset Password</h2>
                    <div className="w-full max-w-sm px-4 py-2">
                        <FormErrorDisplay field="email" formik={requestResetPasswordFormik} />
                        <label htmlFor="email">Email address</label>
                        <input
                            id="email"
                            type="email"
                            className={styles.input}
                            {...requestResetPasswordFormik.getFieldProps("email")}
                        />
                    </div>
                    <Button
                        type="submit"
                        onClick={() => {
                            if (!Object.keys(requestResetPasswordFormik.errors).length) {
                                requestResetPasswordFormik.handleSubmit()
                            } else {
                                requestResetPasswordFormik.setTouched(Object.fromEntries(Object.keys(requestResetPasswordFormik.values).map(field => [field, true])))
                                displayErrorDialog({
                                    name: "Email is missing or invalid".toUpperCase(),
                                    message: "You have not provided a valid email",
                                    details: "Please refer to the red error message above the field for more information"
                                })
                            }
                        }}
                        loading={loading}
                    >
                        Send Reset Password Link
                    </Button>
                </form>
            </Card>
        </Container>
    )
}

export default ForgotPassword