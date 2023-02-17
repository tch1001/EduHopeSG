import Link from "next/link";
import Image from "next/image";
import Container from '../../components/Container';
import Card from '../../components/Card';

export const Courses = (props) => {
    const courses = [
        {
            "name": "GCE A-Level",
            "link": "/subjects/a-level",
            "image": "/images/landing_page/subject.jpg",
            "available_tutors": 10
        },
        {
            "name": "GCE O-Level",
            "link": "/subjects/o-level",
            "image": "/images/landing_page/subject.jpg",
            "available_tutors": 16
        },
        {
            "name": "GCE N-Level",
            "link": "/subjects/n-level",
            "image": "/images/landing_page/subject.jpg",
            "available_tutors": 13
        },
        {
            "name": "Integrated Programme",
            "link": "/subjects/ip",
            "image": "/images/landing_page/subject.jpg",
            "available_tutors": 6
        },
        {
            "name": "International Baccalaureate",
            "link": "/subjects/ib",
            "image": "/images/landing_page/subject.jpg",
            "available_tutors": 4
        },

    ]

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
                                    <p className="font-medium text-sm text-dark-blue">{course.available_tutors} tutors available</p>
                                </div>
                            </Card>
                        </Link>
                    ))
                }
            </main>
        </Container>
    )
}

export default Courses;