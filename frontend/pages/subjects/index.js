import Link from "next/link";
import Image from "next/image";
import Container from '../../components/Container';
import Card from '../../components/Card';

export const Courses = ({ courses }) => {
    return (
        <Container className="p-6 max-w-5xl">
            <div>
                <h1 className="text-3xl font-bold">Available subjects</h1>
                <p className="text-xl">Browse our tutors by your stream or course</p>
            </div>
            <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 py-8 justify-items-center">
                {
                    courses.map((course, key) => (
                        <Link key={key} href={course.link} passHref>
                            <Card className="max-w-xs">
                                <Image className="min-w-full" src={course.image} width={322} height={200} alt="" />
                                <div className="pt-2 pb-4 px-6">
                                    <p className="font-medium text-lg text-dark-aqua">{course.name}</p>
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

export const getStaticProps = async () => {
    const transform = (object) => JSON.parse(JSON.stringify(object));
    const courses = transform((await import("../../data/courses.json")).default);

    return {
        props: {
            courses
        }
    }
}

export default Courses;