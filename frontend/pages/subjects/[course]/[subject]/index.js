import { useState, useContext } from 'react';
import Button from '../../../../components/Button';
import Card from '../../../../components/Card';
import Container from '../../../../components/Container';

import { dialogSettingsContext } from '../../../../helpers/dialogContext';
import useAxios from '../../../../helpers/useAxios';

const TutorCard = ({ tutor }) => {
    return <></>
    const [loading, setLoading] = useState(false);

    const { dialogSettings, setDialogSettings } = useContext(dialogSettingsContext);
    const request = useAxios();

    const handleRequest = async (tutorID) => {
        if (loading) return;
        setLoading(true);

        try {
            const response = await request({
                method: "post",
                path: `/tutee/relationship/${tutorID}`
            })

            console.log(response);
        } catch (err) {
            setDialogSettings({
                ...dialogSettings,
                title: err.name,
                message: `${err.message}. ${err.details}`,
                display: true
            });

            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="py-4 px-6 max-w-full" key={tutor.id}>
            <div>
                <p className="text-dark-blue font-bold">
                    {tutor.name}, {" "}
                    <span className="text-black font-semibold">{tutor.school}</span>
                </p>
                <p className="text-black italic">{tutor.level_of_education}</p>
                <p>{tutor.description}</p>
                <p>
                    <strong className="mr-2">Preferred communication:</strong>
                    <div className="inline-flex flex-row gap-1">
                        {
                            tutor.preferred_communications.map(
                                (communication) => (<span className="bg-dark-aqua text-white py-1 px-2 rounded-sm">{communication}</span>)
                            )
                        }
                    </div>
                </p>
            </div>
            <div className="mt-2">
                <Button
                    onClick={() => handleRequest(tutor.id)}
                    disabled={loading}>
                    {loading ? "Requesting..." : "Request"}
                </Button>
            </div>
        </Card>
    )
}

export const Subject = ({ subject, tutors }) => {
    return (
        <Container className="flex flex-col gap-6 p-6 max-w-5xl">
            <div>
                <h1 className="text-3xl font-bold">
                    <span className="text-dark-aqua">{subject.course}</span>{" "}
                    <span className="underline text-dark-blue">{subject.name}</span>
                    {" "}tutors
                </h1>
                <p className="text-xl">
                    Request help from{" "}
                    <span className="font-semibold">
                        {tutors.length} tutor{tutors.length !== 1 ? "s" : ""}
                    </span>{" "}
                    that would best suit you
                </p>
            </div>
            <main className="flex flex-col gap-4">
                {
                    tutors.length ?
                        tutors.map((tutor) => <TutorCard tutor={tutor} />)
                        : <p>No tutors available for this subject :&#40;</p>
                }
            </main>
        </Container>
    )
}

export const getServerSideProps = async ({ query }) => {
    const URL = `${process.env.NEXT_PUBLIC_API_URL}/subjects/${query.course}/${query.subject}/tutors`;
    const response = await fetch(URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    });

    const { tutors, subject, course } = await response.json();
    console.log(tutors);

    return {
        props: {
            subject: {
                course: course.course_name,
                name: subject.name
            },
            tutors: tutors
        }
    }
}

export default Subject;