import Image from "next/image";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { SubjectCard } from "../components/SubjectCard";
import { BenefitCard } from "../components/home/BenefitCard";
import { TestimonialCard } from "../components/home/TestimonialCard";
import { useEffect, useState } from "react";

export default function Home({ subjects, testimonials }) {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        // update cover image width
        const updateWidth = () => setWidth(window.innerWidth);

        updateWidth();
        window.addEventListener("resize", updateWidth);

        // horizontal scrolling
        const horizontals = document.querySelectorAll(".horizontal-scroll");

        horizontals.forEach((horizontal) => {
            horizontal.addEventListener("wheel", (e) => {
                e.preventDefault();
                horizontal.scrollLeft += convertRemToPixels(28) * Math.sign(e.deltaY);
            });
        });

        function convertRemToPixels(rem) {
            return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
        }
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
            <Container className="flex flex-col gap-20 my-16">
                <div className="flex flex-col items-center gap-9">
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
                <div className="flex flex-col items-center gap-9">
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
                                    href={`/subjects/${key}`}
                                />
                            ))
                        }
                    </div>
                    <Button href="/subjects">
                        Explore more subjects
                    </Button>
                </div>
                <div className="flex flex-col gap-16 my-20">
                    <div className="flex flex-col items-center gap-9">
                        <p className="text-2xl font-semibold">
                            Testimonials from {" "}
                            <span className="text-dark-aqua underline">tutors</span>
                        </p>
                        <div className="horizontal-scroll pb-4">
                            
                            {
                                testimonials.tutors.map((testimonial, key) => (
                                    <TestimonialCard
                                        key={key}
                                        testimonial={testimonial.testimonial}
                                        name={testimonial.name}
                                        member_since={testimonial.joined}
                                        stream={testimonial.stream_taught}
                                        institution={testimonial.current_institution}
                                    />
                                ))
                            }
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-9">
                        <p className="text-2xl font-semibold">
                            Testimonials from {" "}
                            <span className="text-dark-aqua underline">tutees</span>
                        </p>
                        <div className="horizontal-scroll pb-4">

                            {
                                testimonials.tutees.map((testimonial, key) => (
                                    <TestimonialCard
                                        key={key}
                                        testimonial={testimonial.testimonial}
                                        name={testimonial.name}
                                        member_since={testimonial.joined}
                                        stream={testimonial.stream}
                                        institution={testimonial.current_institution}
                                        tutor={false}
                                    />
                                ))
                            }
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export const getServerSideProps = async () => {
    // NOTE: Request from back end server using fetch()
    // JSON file is used as a placeholder for development
    // purposes and will not be used in production!
    const transform = (object) => JSON.parse(JSON.stringify(object));

    const subjects = transform(await import("../data/subjects.json"));
    const testimonials = transform(await import("../data/testimonials.json"));

    return {
        props: {
            subjects: Object.values(subjects).slice(0, 9),
            testimonials
        }
    }
} 