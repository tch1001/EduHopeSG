import Link from "next/link";
import { useRouter } from "next/router";
import Container from '../../../components/Container';
import Card from '../../../components/Card';
import Icon from "../../../components/Icon";
import useAxios from "../../../helpers/useAxios";

export const CourseSubjects = ({ course, subjects }) => {
    const router = useRouter();
    const currentPath = router.asPath;

    return (
        <Container className="p-6 max-w-5xl">
            <div className="flex flex-col items-center sm:items-start gap-3 sm:gap-0">
                <h1 className="text-3xl font-bold text-center sm:text-left">
                    Showing available{" "}
                    <span className="underline text-dark-blue whitespace-nowrap">{course.name}</span>
                    {" "}subjects
                </h1>
                <p className="text-xl text-center sm:text-left">Select the subject that you require help with!</p>
            </div>
            <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-8">
                {
                    subjects.map((subject, key) => (
                        <Link key={key} href={`${currentPath}/${subject.name}`}>
                            <Card className="max-w-xs text-center py-4 mx-auto">
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

export const getServerSideProps = async ({ query, req }) => {
    const request = useAxios()

    const response = await request({
        method: "get",
        path: `/subjects/${query.course}`,
        headers: {
            Cookie: req.headers.cookie
        }
    });    

    const { subjects, course } = await response;

    return {
        props: {
            course: {
                id: course.course_id,
                name: course.course_name
            },
            subjects
        }
    }
}

export default CourseSubjects;