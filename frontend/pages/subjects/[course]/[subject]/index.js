import { useState, useContext } from 'react';
import Button from '../../../../components/Button';
import Card from '../../../../components/Card';
import Container from '../../../../components/Container';

import { dialogSettingsContext } from '../../../../helpers/dialogContext';
import useAxios from '../../../../helpers/useAxios';
import { useRouter } from 'next/router';

const TutorCard = ({ tutor, setTutors }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    const { dialogSettings, setDialogSettings, closeDialog, displayErrorDialog } = useContext(dialogSettingsContext);
    const request = useAxios();

    const handleRequest = async (tutorData) => {
        const { id, subject, subject_id, given_name, family_name } = tutorData

        if (loading) return;
        setLoading(true);

        try {
            const response = await request({
                method: "post",
                path: `/tutee/relationship/${id}`,
                data: { subjects: [subject_id] }
            })

            setDialogSettings({
                title: 'Request Submitted!',
                message: <>Please give {given_name} {family_name} a few days to consider your request for {subject} tutoring.<br/> If you change your mind, you can cancel the request in the <a href="/manage-tutors" className="underline text-dark-blue hover:text-blue">My tutors</a> page.</>,
                display: true,
                buttons: [{ text: "Close", bg: "bg-aqua", callback: closeDialog }],
            });

            // Update status of relationship to disable the request button
            setTutors(prevTutors => {
                return prevTutors.map(tutor => {
                    if (tutor.id == id) { tutor.status = "PENDING" }
                    return tutor
                })
            })

        } catch (err) {
            // if error is user-unauthenticated, open a dialog that explains to the user that they need to log in first, 
            // and a button that redirects them to the login page.
            if (err.status == 401) {
                setDialogSettings({
                    title: "Login/Sign-up Required",
                    message: `Please kindly login into your existing account or sign-up if you do not have an account yet. This way, we can facilitate communication between you and your tutor! `,
                    display: true,
                    buttons: [
                        { text: "Login", bg: "bg-aqua", callback: () => { router.push(`/login?originalURL=${router.asPath}`); closeDialog() } },
                        { text: "Sign-up", bg: "bg-sky-blue", callback: () => { router.push(`/signup?originalURL=${router.asPath}`); closeDialog() } }
                    ],
                });
            } else {
                displayErrorDialog(err)
            }

            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="py-4 px-6 max-w-full mx-0" key={tutor.id}>
            <div className="flex flex-col gap-4">
                <div>
                    <p className="text-dark-blue font-bold">
                        {`${tutor.given_name} ${tutor.family_name}`}, {" "}
                        <span className="text-black font-semibold">{tutor.school}</span>
                    </p>
                    <p className="text-black italic">{tutor.level_of_education}</p>
                    <p className="mt-2 mb-2">{tutor.description}</p>
                </div>
                <div>
                    <strong className="mr-2">Available for tutoring until: </strong> 
                    <span className='whitespace-nowrap'>{new Date(tutor.commitment_end).toLocaleDateString("en-GB", {year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>                
                <div className='flex flex-row gap-y-2 flex-wrap items-center'>
                    <strong className="mr-2">Preferred Consultation Mode(s):</strong>
                    <div className="inline-flex flex-row gap-1">
                        {
                            tutor.preferred_communications.map(
                                (communication, index) => (<span key={index} className="bg-dark-aqua text-white py-1 px-2 rounded-sm">{communication}</span>)
                            )
                        }
                    </div>
                </div>
            </div>
            <div className="mt-7 sm:mt-4">
                <Button
                    onClick={() => handleRequest(tutor)}
                    loading={loading}
                    disabled={tutor.status}>
                    {loading ? "" :
                        tutor.status == "PENDING" ? "Requested" :
                            tutor.status == "ACCEPTED" ? "Accepted" : "Request"}
                </Button>
            </div>
        </Card>
    )
}

export const Subject = ({ subject, initTutors }) => {
    const [tutors, setTutors] = useState(initTutors)

    return (
        <Container className="flex flex-col gap-6 p-6 max-w-5xl">
            <div className="flex flex-col items-center sm:items-start gap-3 sm:gap-0">
                <h1 className="text-3xl font-bold text-center sm:text-left">
                    <span className="text-dark-aqua whitespace-nowrap">{subject.course}</span>{" "}
                    <span className="underline text-dark-blue whitespace-nowrap">{subject.name}</span>
                    {" "}tutors
                </h1>
                <p className="text-xl text-center sm:text-left">
                    Request help from{" "}
                    <span className="font-semibold">
                        {tutors.length} tutor{tutors.length !== 1 ? "s" : ""}
                    </span>{" "}
                    that would best suit you!
                </p>
            </div>
            <main className="flex flex-col gap-4">
                {
                    tutors.length ?
                        tutors.map((tutor) => <TutorCard key={tutor.id} tutor={tutor} setTutors={setTutors} />)
                        : <p>No tutors available for this subject :&#40;</p>
                }
            </main>
        </Container>
    )
}

export const getServerSideProps = async ({ query, req }) => {
    const request = useAxios()

    const response = await request({
        method: "get",
        path: `/subjects/${query.course}/${query.subject}/tutors`,
        headers: {
            Cookie: req.headers.cookie
        }
    });

    const { tutors, subject, course } = response;

    return {
        props: {
            subject: {
                course: course.course_name,
                name: subject.name
            },
            initTutors: tutors
        }
    }
}

export default Subject;