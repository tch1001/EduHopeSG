import Image from "next/image";
import { Container } from "../components/container";
import { useEffect, useState } from "react";

const BenefitCard = ({ illustration, tagline, description, reversed = false, secondary = false }) => {
    const reversedClass = reversed ? "-reverse" : "";
    const flexDirection = `flex-col${reversedClass} md:flex-row${reversedClass}`;

    const boarderStyle = "border border-gray-200";
    
    let compoundedClassName = `flex ${flexDirection} gap-12 ${boarderStyle} bg-gray-50 rounded-xl sm:w-9/12 px-4 sm:px-16 py-12 items-center`;

    
    return (
        <div className={compoundedClassName}>
            <Image className="w-fit md:w-1/2"  src={illustration} width={300} height={300} />
            <div className="text-black">
                <p className="uppercase text-2xl font-medium">{tagline}</p>
                <p className="text-base">{description}</p>
            </div>
        </div>
    )
}

export default function Home() {
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
            <Container center className="py-12 gap-9">
                <BenefitCard
                    illustration="/images/landing_page/study_anywhere.png"
                    tagline="Free and flexible consultations"
                    description="Our volunteer tutors are passionate graduates who want you to succeed in your student life!"
                />
                <BenefitCard
                    reversed
                    illustration="/images/landing_page/5_stars.png"
                    tagline="Quality Control"
                    description="Every tutor is reviewed and vetted by our team to ensure you get the very best."
                />

            </Container>
        </div>
    )
}

