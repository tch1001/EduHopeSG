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

const COMMUNICATIONS = [
    'Texting',
    'Virtual Consultation',
    'Face-to-Face'
]

const EditProfile = ({ initPersonalParticulars, initTutorSettings, is_tutor, error, subjects }) => {

    const [user, { logout }] = useUser()
    const [loading, setLoading] = useState(false);
    const [schools, setSchools] = useState([]);
    const [selection, setSelection] = useState("Personal Particulars")

    const [personalParticularsSaved, setPersonalParticularsSaved] = useState(false)
    const [tutorSettingsSaved, setTutorSettingsSaved] = useState(false)

    const [previouslySavedPersonalParticulars, setPreviouslySavedPersonalParticulars] = useState(initPersonalParticulars)
    const [previouslySavedTutorSettings, setPreviouslySavedTutorSettings] = useState(initTutorSettings)

    const { dialogSettings, setDialogSettings, closeDialog, displayErrorDialog } = useContext(dialogSettingsContext);

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
            .catch(err => displayErrorDialog(err));

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
            setPersonalParticularsSaved(true)

            console.log(response);
        } catch (err) {
            displayErrorDialog(err);
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
        commitmentEnd: Yup
            .date()
            .default(null)
            .min(new Date(Date.now() + 2.592e+9), "We require a minimum of 1 month commitment from our tutors")
            .required("Required"),
        tuteeLimit: Yup
            .number()
            .default(null)
            .min(1)
            .max(5)
            .required("Required"),
        subjects: Yup
            .array()
            .of(
                Yup.object()
            )
            .default([])
            .min(1, "Required")
            .required("Required"),
        preferredCommunications: Yup
            .array()
            .of(
                Yup.object()
            )
            .default([])
            .min(1, "Required")
            .required("Required"),
        averageResponseTime: Yup
            .string()
            .default("")
            .min(0)
            .max(50, "Maximum of 50 characters")
            .optional(),
    })
    async function handleTutorSettingsSave({
        commitmentEnd,
        tuteeLimit,
        averageResponseTime,
        preferredCommunications,
        subjects
    }) {
        if (loading) return;
        setLoading(true);

        try {
            const data = {
                commitment_end: commitmentEnd,
                tutee_limit: tuteeLimit,
                average_response_time: averageResponseTime,
                preferred_communications: preferredCommunications.map(obj => obj.value),
                subjects: subjects.map(obj => obj.value)
            }

            const response = await request({
                method: "patch",
                path: "/tutor",
                data
            });

            // This will reset the formik's initialValues, allowing the resetForm method to function as a "cancel" method that
            // revert's the form's fields to their previously saved values. 
            setPreviouslySavedTutorSettings({
                commitmentEnd,
                tuteeLimit,
                averageResponseTime,
                preferredCommunications,
                subjects
            })
            setTutorSettingsSaved(true)

            console.log(response);
        } catch (err) {
            displayErrorDialog(err);
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
                                    if (!Object.keys(personalParticularsFormik.errors).length) {
                                        personalParticularsFormik.handleSubmit()
                                    } else {
                                        displayErrorDialog({
                                            name: "Missing/Invalid Field Value(s)".toUpperCase(),
                                            message: "One or more fields have missing or invalid values",
                                            details: "Please refer to the red error message above each field for more information"
                                        })
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
                    <label htmlFor="commitmentEnd">When can you volunteer until?</label>
                    <input type="date" id="commitmentEnd" {...tutorSettingsFormik.getFieldProps("commitmentEnd")} disabled={tutorSettingsSaved} />
                </div>
                <div className="w-full max-w-sm px-4 py-2">
                    <FormErrorDisplay field="tuteeLimit" formik={tutorSettingsFormik} />
                    <label htmlFor="tuteeLimit">{"What's the maximum number of tutees you can manage?"}</label>
                    <input type="number" id="tuteeLimit" {...tutorSettingsFormik.getFieldProps("tuteeLimit")} disabled={tutorSettingsSaved} />
                </div>
                <div className="w-full max-w-sm px-4 py-2">
                    <FormErrorDisplay field="averageResponseTime" formik={tutorSettingsFormik} />
                    <label htmlFor="averageResponseTime">{"What's your average response time?"}</label>
                    <input id="averageResponseTime" name="averageResponseTime" {...tutorSettingsFormik.getFieldProps("averageResponseTime")} disabled={tutorSettingsSaved}/>
                </div>
                <div className="w-full max-w-sm px-4 py-2">
                    <FormErrorDisplay field="preferredCommunications" formik={tutorSettingsFormik} />
                    <label htmlFor="preferredCommunications">{"What are your preferred mode(s) of consultation?"}</label>
                    <Select isSearchable isMulti isDisabled={tutorSettingsSaved}
                        id="preferredCommunications"
                        name="preferredCommunications"
                        options={
                            COMMUNICATIONS.map(mode => ({ value: mode, label: mode }))
                        }
                        onChange={selectedOptions => {
                            tutorSettingsFormik.setFieldValue("preferredCommunications", selectedOptions)
                        }
                        }
                        value={tutorSettingsFormik.values.preferredCommunications}
                        onBlur={() => tutorSettingsFormik.setFieldTouched("preferredCommunications", true)}
                    />
                </div>
                <div className="w-full max-w-sm px-4 py-2">
                    <FormErrorDisplay field="subjects" formik={tutorSettingsFormik} />
                    <label htmlFor="subjects">{"What subject(s) are you willing to tutor?"}</label>
                    <Select isSearchable isMulti isDisabled={tutorSettingsSaved}
                        id="subjects"
                        name="subjects"
                        options={
                            subjects.map(subject => ({ value: subject.id, label: subject.name }))
                        }
                        onChange={selectedOptions => {
                            tutorSettingsFormik.setFieldValue("subjects", selectedOptions);
                            console.log(tutorSettingsFormik)
                        }
                        }
                        value={tutorSettingsFormik.values.subjects}
                        onBlur={() => tutorSettingsFormik.setFieldTouched("subjects", true)}
                    />
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
                                    } else {
                                        displayErrorDialog({
                                            name: "Missing/Invalid Field Value(s)".toUpperCase(),
                                            message: "One or more fields have missing or invalid values",
                                            details: "Please refer to the red error message above each field for more information"
                                        })
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
        const subjectResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subjects/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });
        const { subjects } = await subjectResponse.json()        
    
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
                    is_tutor: false,
                    subjects
                }
            }
        }

        else {
            let correctedDate = new Date(response.tutorData.commitment_end.split("T")[0])
            correctedDate.setDate(correctedDate.getDate() + 1)
            correctedDate = correctedDate.toISOString().split("T")[0]

            const subjectsMapping = Object.fromEntries(subjects.map(obj => [obj.id, obj.name]))

            const initTutorSettings = {
                commitmentEnd: correctedDate,
                tuteeLimit: response.tutorData.tutee_limit,
                averageResponseTime: response.tutorData.average_response_time,
                preferredCommunications: response.tutorData.preferred_communications.map(mode => ({value: mode, label: mode})),
                subjects: response.tutorData.subjects.map(sub_id => ({value: sub_id, label: subjectsMapping[sub_id]}))
            }
            return {
                props: {
                    initPersonalParticulars,
                    initTutorSettings,
                    is_tutor: true,
                    subjects
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
