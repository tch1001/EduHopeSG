import Link from "next/link";
import Image from "next/image";
import Container from '../../../components/Container';
import Card from '../../../components/Card';

export const CourseSubjects = ({ course, subjects }) => {
    return (
        <Container className="p-6 max-w-5xl">
            <div>
                <h1 className="text-3xl font-bold">
                    Showing available{" "}
                    <span className="underline text-dark-blue">{course.name}</span>
                    {" "}subjects
                </h1>
                <p className="text-xl">Select the subject that you require help with</p>
            </div>
            <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 py-8 justify-items-center">
                {
                    subjects.map((subject, key) => (
                        <Link key={key} href={subject.link} passHref>
                            <Card className="max-w-xs">
                                <Image className="min-w-full" src={subject.image} width={322} height={200} alt="" />
                                <div className="pt-2 pb-4 px-6">
                                    <p className="font-medium text-lg text-dark-aqua">{subject.name}</p>
                                    <p className="font-medium text-sm text-dark-blue">
                                        {subject.tutor_count} tutor{subject.tutor_count !== 1 ? "s" : ""} available
                                    </p>
                                </div>
                            </Card>
                        </Link>
                    ))
                }
            </main>
        </Container>
    )
}

export const getServerSideProps = async ({ query, resolvedUrl }) => {
    const transform = (object) => JSON.parse(JSON.stringify(object));
    const courses = transform((await import("../../../data/courses.json")).default);
    const subjects = transform((await import("../../../data/subjects.json")).default);

    const course = courses.filter(({ link }) => link === resolvedUrl)[0];
    const filteredSubjects = subjects.filter(({ course: subjectCourse }) => subjectCourse === course.name);

    return {
        props: {
            course,
            subjects: filteredSubjects
        }
    }
}

export default CourseSubjects;