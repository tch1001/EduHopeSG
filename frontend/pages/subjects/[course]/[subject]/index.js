import Button from '../../../../components/Button';
import Card from '../../../../components/Card';
import Container from '../../../../components/Container';

export const Subject = ({ subject, tutors }) => {
    const handleRequest = (tutorID) => {
        // request to tutor
    }

    return (
        <Container className="flex flex-col gap-3 p-6 max-w-7xl">
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
                    tutors.map((tutor, key) => (
                        <Card className="py-4 px-6 max-w-max">
                            <div>
                                <p className="text-dark-blue font-bold">
                                    {tutor.given_name}, {" "}
                                    <span className="text-black font-semibold">{tutor.current_institution}</span>
                                </p>
                                <p>{tutor.description}</p>
                            </div>
                            <div className="pt-2">
                                <Button onClick={() => handleRequest(tutor.id)}>Request</Button>
                            </div>
                        </Card>
                    ))
                }
            </main>
        </Container>
    )
}

export const getServerSideProps = async ({ query }) => {
    // get tutor info
    const transform = (object) => JSON.parse(JSON.stringify(object));
    const tutors = transform((await import("../../../../data/tutors.json")).default);
    const subjects = transform((await import("../../../../data/subjects.json")).default);

    const subject = subjects.filter(({ name }) => name.toLowerCase() === query.subject.toLowerCase())[0];

    return {
        props: {
            subject,
            tutors
        }
    }
}

export default Subject;