import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Button from "../../components/Button";
import Container from "../../components/Container";
import Card from "../../components/Card";
import FormErrorDisplay from "../../components/FormErrorDisplay";

import useAxios from "../../helpers/useAxios";
import { dialogSettingsContext } from "../../helpers/dialogContext";

import styles from "../../styles/forms.module.css";
import useUser from "../../helpers/useUser";

const TutorSignUp = () => {
    const [loading, setLoading] = useState(false);
    const [schools, setSchools] = useState([]);

    const { dialogSettings, setDialogSettings, closeDialog, displayErrorDialog } = useContext(dialogSettingsContext);

    const [user, { login }] = useUser();
    const request = useAxios();

    if (user.id) router.push("/");

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
                name: [firstName, lastName].join(" "),
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
            window.location.href = "/";
        } catch (err) {
            displayErrorDialog(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container center className="p-6 max-w-5xl">
            <Card className="p-4 m-2 shadow-md shadow-slate-300 sm:min-w-xs">

            </Card>
            <p className="p-2">
                Already have an account with us?{" "}
                <Link href="/login" className="link" passHref>Login in here</Link>
            </p>
            <p className="p-1">
                Sign up as a tutee instead?{" "}
                <Link href="/signup" className="link" passHref>Register as a tutee</Link>
            </p>
        </Container>
    );
};

export default TutorSignUp;
