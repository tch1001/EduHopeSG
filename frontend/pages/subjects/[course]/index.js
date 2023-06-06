import Link from "next/link";
import { useRouter } from "next/router";
import Container from '../../../components/Container';
import Card from '../../../components/Card';
import Icon from "../../../components/Icon";

export const CourseSubjects = ({ course, subjects }) => {
    const router = useRouter();
    const currentPath = router.asPath;

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
            <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-8">
                {
                    subjects.map((subject, key) => (
                        <Link key={key} href={`${currentPath}/${subject.short_name}`}>
                            <Card className="max-w-xs text-center py-4">
                                <div className="border rounded-full p-10 inline-block">
                                    <Icon icon="clipboard-document" className="inline" alt="" />
                                </div>

                                <div className="pt-2 px-6">
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

export const getServerSideProps = async ({ params }) => {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subjects/${params.course}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    });

    const { subjects } = await response.json();

    return {
        props: {
            course: {
                id: subjects[0]?.course_id,
                name: subjects[0]?.course || null
            },
            subjects
        }
    }
}

export default CourseSubjects;