import Link from "next/link";
import Container from '../../components/Container';
import Card from '../../components/Card';
import Icon from "../../components/Icon";
import { useRouter } from "next/router";

export const Courses = ({ courses }) => {
    const router = useRouter();
    const currentPath = router.asPath;

    return (
        <Container className="p-6 max-w-5xl">
            <div>
                <h1 className="text-3xl font-bold">Available subjects</h1>
                <p className="text-xl">Browse our tutors by your stream or course</p>
            </div>
            <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-8">
                {
                    courses.map((course, key) => (
                        <Link key={key} href={`${currentPath}/${course.short_name}`} passHref>
                            <Card className="max-w-xs text-center py-4">
                                <div className="border rounded-full p-10 inline-block">
                                    <Icon icon="clipboard-document" className="inline" alt="" />
                                </div>
                                <div className="pt-2 px-6">
                                    <p className="font-medium text-lg text-dark-aqua">{course.course_name}</p>
                                    <p className="font-medium text-sm text-dark-blue">{course.tutor_count} tutors available</p>
                                </div>
                            </Card>
                        </Link>
                    ))
                }
            </main>
        </Container>
    )
}

export const getServerSideProps = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subjects`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    });

    const { courses } = await response.json();

    return {
        props: {
            courses
        }
    }
}

export default Courses;