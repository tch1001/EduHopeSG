import Button from '../../../../components/Button';
import Container from '../../../../components/Container';

export const Subject = ({ subject, tutors }) => {
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
            <main>
                <div className="overflow-auto">
                    <table className="table-fixed">
                        <thead>
                            <tr>
                                <th className="min-w-[92px] w-1/12 border-b-2 border-slate-600 text-lg font-semibold px-2 py-4 text-left">Name</th>
                                <th className="min-w-[118px] w-1/6 border-b-2 border-slate-600 text-lg font-semibold px-2 py-4 text-left">Current education</th>
                                <th className="min-w-[323px] w-full border-b-2 border-slate-600 text-lg font-semibold px-2 py-4 text-left">Description</th>
                                <th className="w-12 border-b-2 border-slate-600"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tutors.map((tutor, key) => (
                                    <tr className="" key={key}>
                                        <td className="px-2">{tutor.given_name}</td>
                                        <td className="px-2">{tutor.current_institution}</td>
                                        <td className="px-2 py-6">{tutor.description}</td>
                                        <td><Button>Request</Button></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
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