import { useFormik } from "formik";
import { useState, useEffect } from "react";
import Container from "../components/Container";
import Button from "../components/Button";
import Card from "../components/Card";
import FormErrorDisplay from "../components/FormErrorDisplay";

import useAxios from "../helpers/useAxios"
import useUser from "../helpers/useUser"
import Yup from "../helpers/Yup";

import styles from "../styles/forms.module.css";


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

const EditProfile = ({ initPersonalParticulars, initTutorSettings, is_tutor, error }) => {

    const [user, { logout }] = useUser()
    const [loading, setLoading] = useState(false);
    const [schools, setSchools] = useState([]);
    const [selection, setSelection] = useState("Personal Particulars")

    const [personalParticularsSaved, setPersonalParticularsSaved] = useState(false)
    const [tutorSettingsSaved, setTutorSettingsSaved] = useState(false)

    const [previouslySavedPersonalParticulars, setPreviouslySavedPersonalParticulars] = useState(initPersonalParticulars)
    const [previouslySavedTutorSettings, setPreviouslySavedTutorSettings] = useState(initTutorSettings)

    const request = useAxios();

    if (error) {
        return <div>{error}</div>
    }

    useEffect(() => {
        request({
            method: "get",
            path: "/school"
        })
            .then(({ result }) => setSchools(result.map(({ name }) => name)))
            .catch(err => console.error(err));

        // get education levels and referrals from server?
    }, [])

    const PersonalParticularsSchema = Yup.object({
        firstName: Yup.string()
            .min(3, "Given name has to be at least 3 characters")
            .max(35, "Given name is too long")
            .matches(/^[A-Z][a-z]*$/, "Capitalise the first letter only")
            .required("Required"),
        lastName: Yup.string()
            .min(1, "Family name has to be at least 1 characters")
            .max(35, "Family name too long")
            .matches(/^[A-Z][a-z]*$/, "Capitalise the first letter only")
            .required("Required"),
        school: Yup.string().required("Required"),
        email: Yup.string()
            .email("Invalid email address")
            .required("Required")
            .max(320, "Email address too long"),
        telegram: Yup.string()
            .required("Required")
            .min(5, "Telegram handles must have at least 5 characters")
            .max(32, "Telegram handles can have at most 32 characters")
            .matches(/^[a-zA-Z0-9_]*$/, "Can only contain alphanumeric characters and underscores (_)"),
        levelOfEducation: Yup.string().required("Required"),
        bio: Yup.string()
            .max(500, "Maximum of 500 characters")
            .optional(),
    });
    async function handlePersonalParticularsSave({
        firstName,
        lastName,
        email,
        school,
        levelOfEducation,
        telegram,
        bio
    }) {
        // This will reset the formik's initialValues, allowing the resetForm method to function as a "cancel" method that
        // revert's the form's fields to their previously saved values. 
        setPreviouslySavedPersonalParticulars({
            firstName,
            lastName,
            school,
            email,
            telegram,
            levelOfEducation,
            bio,
        })

        if (loading) return;
        setLoading(true);

        try {
            const data = {
                given_name: firstName,
                family_name: lastName,
                level_of_education: levelOfEducation,
                telegram,
                email,
                school,
                bio
            }

            const response = await request({
                method: "patch",
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
    const personalParticularsFormik = useFormik({
        validationSchema: PersonalParticularsSchema,
        onSubmit: handlePersonalParticularsSave,
        initialValues: initPersonalParticulars
    });

    const TutorSettingsSchema = Yup.object({
        commitmentEnd: Yup.date()
    })
    async function handleTutorSettingsSave({
        commitmentEnd
    }) {
        // This will reset the formik's initialValues, allowing the resetForm method to function as a "cancel" method that
        // revert's the form's fields to their previously saved values. 
        setPreviouslySavedTutorSettings({
            commitmentEnd
        })

        if (loading) return;
        setLoading(true);

        try {
            const data = {
                commitment_end: commitmentEnd
            }

            const response = await request({
                method: "patch",
                path: "/tutor",
                data
            });

            console.log(response);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    const tutorSettingsFormik = useFormik({
        validationSchema: TutorSettingsSchema,
        onSubmit: handleTutorSettingsSave,
        initialValues: initTutorSettings
    })


    const profileFields = {
        "Personal Particulars":
            <>
                <div className="w-full max-w-sm px-4 py-2">
                    <FormErrorDisplay field="firstName" formik={personalParticularsFormik} />
                    <label htmlFor="firstName">Given name</label>
                    <input id="firstName" {...personalParticularsFormik.getFieldProps("firstName")} disabled={personalParticularsSaved} />
                </div>
                <div className="w-full max-w-sm px-4 py-2">
                    <FormErrorDisplay field="lastName" formik={personalParticularsFormik} />
                    <label htmlFor="lastName">Last name</label>
                    <input id="lastName" {...personalParticularsFormik.getFieldProps("lastName")} disabled={personalParticularsSaved} />
                </div>
                <div className="w-full max-w-sm px-4 py-2">
                    <FormErrorDisplay field="school" formik={personalParticularsFormik} />
                    <label htmlFor="school">School</label>
                    <select id="school" {...personalParticularsFormik.getFieldProps("school")} disabled={personalParticularsSaved}>
                        <option>--Select--</option>
                        <option>Graduated</option>
                        <option>In National Service</option>
                        {schools.map((school, i) => (
                            <option key={i}>{school}</option>
                        ))}
                    </select>
                </div>
                <div className="w-full max-w-sm px-4 py-2">
                    <FormErrorDisplay field="levelOfEducation" formik={personalParticularsFormik} />
                    <label htmlFor="levelOfEducation">Current level of education</label>
                    <select id="levelOfEducation" {...personalParticularsFormik.getFieldProps("levelOfEducation")} disabled={personalParticularsSaved}>
                        <option>--Select--</option>
                        {EDUCATION_TYPES.map((level, i) => (
                            <option key={i}>{level}</option>
                        ))}
                    </select>
                </div>
                <div className="w-full max-w-sm px-4 py-2">
                    <FormErrorDisplay field="telegram" formik={personalParticularsFormik} />
                    <label htmlFor="telegram">Telegram Handle</label>
                    <div>
                        <span className={styles.slotItem}>@</span>
                        <input
                            id="telegram"
                            className={styles.slot}
                            {...personalParticularsFormik.getFieldProps("telegram")}
                            disabled={personalParticularsSaved}
                        />
                    </div>
                </div>
                <div className="w-full max-w-sm px-4 py-2">
                    <FormErrorDisplay field="email" formik={personalParticularsFormik} />
                    <label htmlFor="email">Email address</label>
                    <input
                        id="email"
                        type="email"
                        className={styles.input}
                        {...personalParticularsFormik.getFieldProps("email")}
                        disabled={personalParticularsSaved}
                    />
                </div>
                <div className="w-full max-w-sm px-4 py-2">
                    <FormErrorDisplay field="bio" formik={personalParticularsFormik} />
                    <label htmlFor="bio">Biography</label>
                    <textarea
                        {...personalParticularsFormik.getFieldProps("bio")}
                        placeholder="Give a short biography of yourself (max 500 characters)"
                        disabled={personalParticularsSaved}
                    />
                </div>
                <div className="flex flex-row gap-2">
                    {personalParticularsSaved ?
                        <>
                            <Button
                                onClick={() => { setPersonalParticularsSaved(false) }}
                                loading={loading}
                            >
                                Edit
                            </Button>
                        </>
                        :
                        <>
                            <Button
                                type="submit"
                                onClick={() => {
                                    console.log(personalParticularsFormik)
                                    if (!Object.keys(personalParticularsFormik.errors).length) {
                                        personalParticularsFormik.handleSubmit()
                                        setPersonalParticularsSaved(true)
                                    }
                                }}
                                loading={loading}
                            >
                                Save
                            </Button>
                            <Button
                                onClick={() => { personalParticularsFormik.setValues(previouslySavedPersonalParticulars) }}
                                loading={loading}
                                style={{ backgroundColor: "rgb(191, 231, 255, 0.2)" }}
                            >
                                Cancel
                            </Button>
                        </>
                    }
                </div>
            </>
        ,
        "Tutor Settings":
            <>
                <div className="w-full max-w-sm px-4 py-2">
                    <FormErrorDisplay field="commitmentEnd" formik={tutorSettingsFormik} />
                    <label htmlFor="commitmentEnd">Commitment End Date</label>
                    <input type="date" id="commitmentEnd" {...tutorSettingsFormik.getFieldProps("commitmentEnd")} disabled={tutorSettingsSaved} />
                </div>
                <div className="flex flex-row gap-2">
                    {tutorSettingsSaved ?
                        <>
                            <Button
                                onClick={() => { setTutorSettingsSaved(false) }}
                                loading={loading}
                            >
                                Edit
                            </Button>
                        </>
                        :
                        <>
                            <Button
                                type="submit"
                                onClick={() => {
                                    if (!Object.keys(tutorSettingsFormik.errors).length) {
                                        tutorSettingsFormik.handleSubmit()
                                        setTutorSettingsSaved(true)
                                    }
                                }}
                                loading={loading}
                            >
                                Save
                            </Button>
                            <Button
                                onClick={() => { tutorSettingsFormik.setValues(previouslySavedTutorSettings) }}
                                loading={loading}
                                style={{ backgroundColor: "rgb(191, 231, 255, 0.2)" }}
                            >
                                Cancel
                            </Button>
                        </>
                    }
                </div>
            </>
    }

    return (
        <Container center className="p-6 max-w-5xl">
            <div className={`grid ${is_tutor ? "grid-cols-2" : "grid-cols-1"} bg-slate-100 rounded-sm max-w-sm sm:min-w-xs`}>
                <button onClick={() => { setSelection("Personal Particulars") }} className={selection === "Personal Particulars" ? "bg-slate-300" : "bg-slate-100"}>
                    <div className="p-2 text-center text-lg">Personal Particulars</div>
                </button>
                {is_tutor ? (
                    <button onClick={() => { setSelection("Tutor Settings") }} className={selection === "Tutor Settings" ? "bg-slate-300" : "bg-slate-100"}>
                        <div className="p-2 text-center text-lg">Tutor Settings</div>
                    </button>
                )
                    : null}
            </div>
            <Card className="p-4 m-2 shadow-md shadow-slate-300 sm:min-w-xs">
                <form
                    className={styles.form}
                    onSubmit={(e) => e.preventDefault()}
                    noValidate
                >
                    {profileFields[selection]}
                </form>
            </Card>
        </Container>
    )
}

export default EditProfile


export const getServerSideProps = async ({ req, resolvedUrl }) => {
    const request = useAxios()

    try {
        const response = await request({
            method: "get",
            path: "/user/profile",
            headers: {
                Cookie: req.headers.cookie
            }
        });

        const initPersonalParticulars = {
            firstName: response.userData.given_name,
            lastName: response.userData.family_name,
            school: response.userData.school,
            email: response.userData.email,
            telegram: response.userData.telegram,
            levelOfEducation: response.userData.level_of_education,
            bio: response.userData.bio,
        }

        if (!response.tutorData) {
            return {
                props: {
                    initPersonalParticulars,
                    is_tutor: false
                }
            }
        }

        else {
            const initTutorSettings = {
                commitmentEnd: response.tutorData.commitment_end.split("T")[0]
            }
            return {
                props: {
                    initPersonalParticulars,
                    initTutorSettings,
                    is_tutor: true
                }
            }
        }

    } catch (err) {
        console.error(err);

        if (err.status) {
            return {
                redirect: {
                    destination: `/login?originalURL=${resolvedUrl}`,
                    permanent: false,
                },
            }
        }

        else {
            return {
                props: {
                    error: err.message
                }
            }
        }
    }

}
