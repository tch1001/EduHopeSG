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
            <div className="flex flex-col items-center sm:items-start gap-2 sm:gap-0"> 
                <h1 className="text-3xl font-bold text-center sm:text-left">Available subjects</h1>
                <p className="text-xl text-center sm:text-left">Browse our tutors by your stream or course!</p>
            </div>
            <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-8">
                {
                    courses.map((course, key) => (
                        <Link key={key} href={`${currentPath}/${course.short_name}`} passHref>
                            <Card className="max-w-xs text-center py-4 mx-auto hover:bg-slate-100">
                                <div className="px-6">
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