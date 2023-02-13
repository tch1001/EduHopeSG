import Image from "next/image";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { SubjectCard } from "../components/SubjectCard";
import { BenefitCard } from "../components/home/BenefitCard";
import { useEffect, useState } from "react";

export default function Home({ subjects }) {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const updateWidth = () => setWidth(window.innerWidth)

        updateWidth();
        window.addEventListener("resize", updateWidth);
    });

    return (
        <div>
            <div className="relative text-center text-white">
                <Image
                    src="/images/landing_page/cover_banner.jpg"
                    className="w-screen h-fit object-cover"
                    style={{ height: "calc(100vh - 61px)" }}
                    width={width}
                    height={width}
                    quality={100}
                    alt=""
                />
                <div className="cover flex flex-col gap-1 m-auto text-white text-center text-3xl">
                    <p className="uppercase font-bold">Connect, Learn and Grow</p>
                    <p>Empowering students through free and flexible tutoring.</p>
                </div>
            </div>
            <Container>
                <div className="flex flex-col items-center my-12 gap-9">
                    <BenefitCard
                        illustration="/images/landing_page/study_anywhere.png"
                        tagline="Free and flexible consultations"
                        description="Our volunteer tutors are passionate graduates who want you to succeed in your student life!"
                    />
                    <BenefitCard
                        alternate
                        illustration="/images/landing_page/5_stars.png"
                        tagline="Quality Control"
                        description="Every tutor is reviewed and vetted by our team to ensure you get the very best."
                    />
                    <BenefitCard
                        illustration="/images/landing_page/study_anywhere.png"
                        tagline="Build Connections, Enhance Your Learning."
                        description="Find your perfect study partner and form meaningful relationships with experienced tutors."
                    />
                    <BenefitCard
                        alternate
                        illustration="/images/landing_page/5_stars.png"
                        tagline="Expand Your Horizons"
                        description="Get advice and guidance beyond academics and enhance your overall learning experience."
                    />
                    <BenefitCard
                        illustration="/images/landing_page/study_anywhere.png"
                        tagline="Learn from the Best, Reach Your Potential."
                        description="Get personalized attention from young veterans who have excelled in their studies and reach your full potential."
                    />
                </div>
                <div className="flex flex-col items-center my-12 gap-9">
                    <p className="text-2xl font-semibold">Subjects available</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                        {
                            subjects.map((subject, key) => (
                                <SubjectCard
                                    key={key}
                                    image={"/images/landing_page/subject.jpg"}
                                    name={subject.name}
                                    stream={subject.course}
                                    tutors={subject.tutor_count}
                                    className="cursor-pointer"
                                    href={`/subjects/${key}`}
                                />
                            ))
                        }
                    </div>
                    <Button href="/subjects">
                        Explore more subjects
                    </Button>
                </div>
            </Container>
        </div>
    )
}

export const getServerSideProps = async () => {
    // TODO: Request from back end server using fetch()
    // JSON file is used as a placeholder for development
    // purposes and will not be used in production!
    const file = await import("../data/subjects.json");
    const subjects = Object.values(JSON.parse(JSON.stringify(file)));

    // only need 9 for landing
    subjects.splice(9);

    return {
        props: {
            subjects
        }
    }
} 