import { useFormik } from "formik";
import { useState, useEffect, useContext } from "react";
import Container from "../components/Container";
import Button from "../components/Button";
import Card from "../components/Card";
import FormErrorDisplay from "../components/FormErrorDisplay";
import Select from "react-select"

import { dialogSettingsContext } from "../helpers/dialogContext";
import useAxios from "../helpers/useAxios"
import useUser from "../helpers/useUser"
import Yup from "../helpers/Yup";

import styles from "../styles/forms.module.css";

const resetPassword = ({passwordResetToken}) => {
    const [user, { login }] = useUser()
    const [passwordLoading, setPasswordLoading] = useState(false);

    const {setDialogSettings, closeDialog, displayErrorDialog} = useContext(dialogSettingsContext)


    const resetPasswordSchema = Yup.object({
        newPassword: Yup.string()
            .default("")
            .required("Required")
            .password()
            .min(12, "Password has to be at least 12 characters long"),
        confirmNewPassword: Yup.string()
            .default("")
            .required("Required")
            .password()
            .min(12, "Password has to be at least 12 characters long")
            .test("test-match", "Passwords should match", (value, context) => {
                const { newPassword } = context.parent;
                return newPassword === value;
            }),
    })
    async function handleResetPasswordSave({
        passwordResetToken,
        newPassword
    }) {
        if (loading) return;
        setPasswordLoading(true);

        try {
            const data = {
                passwordResetToken,
                new_password: newPassword
            }

            const response = await request({
                method: "patch",
                path: "/user/password",
                data
            });

            setDialogSettings({
                title: 'Password Updated!',
                message: `Make sure to use this new password from now onwards!`,
                display: true,
                buttons: [{ text: "Close", bg: "bg-aqua", callback: closeDialog }],
            });

            resetPasswordFormik.resetForm()

        } catch (err) {
            displayErrorDialog(err);
        } finally {
            setPasswordLoading(false);
        }
    }
    const resetPasswordFormik = useFormik({
        validationSchema: resetPasswordSchema,
        onSubmit: handleResetPasswordSave,
        initialValues: resetPasswordSchema.default()
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
                        <FormErrorDisplay field="newPassword" formik={resetPasswordFormik} />
                        <input
                            id="newPassword"
                            type="password"
                            autoComplete="newPassword"
                            placeholder="New password"
                            className={styles.input}
                            {...resetPasswordFormik.getFieldProps("newPassword")}
                        />
                    </div>
                    <div className="w-full max-w-sm px-4 py-2">
                        <FormErrorDisplay field="confirmNewPassword" formik={resetPasswordFormik} />
                        <input
                            id="confirmNewPassword"
                            type="password"
                            autoComplete="new-password"
                            placeholder="Confirm new password"
                            className={styles.input}
                            {...resetPasswordFormik.getFieldProps("confirmNewPassword")}
                        />
                    </div>
                    <Button
                        type="submit"
                        onClick={() => {
                            if (!Object.keys(resetPasswordFormik.errors).length) {
                                resetPasswordFormik.handleSubmit()
                            } else {
                                resetPasswordFormik.setTouched(Object.fromEntries(Object.keys(resetPasswordFormik.values).map(field => [field, true])))
                                displayErrorDialog({
                                    name: "Missing/Invalid Field Value(s)".toUpperCase(),
                                    message: "One or more fields have missing or invalid values",
                                    details: "Please refer to the red error message above each field for more information"
                                })
                            }
                        }}
                        loading={passwordLoading}
                    >
                        Reset
                    </Button>
                </form>
            </Card>
        </Container>
    )


}

export default resetPassword