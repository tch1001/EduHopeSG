import Image from "next/image";
import { Container } from "../components/container";
import { useEffect, useState } from "react";

const BenefitCard = ({ illustration, tagline, description, alternate = false }) => {
    const flexDirection = "flex-col md:flex-row";
    const padding = "sm:w-9/12 p-8 sm:px-16 sm:py-12";
    const colorStyling = `border border-${alternate ? "dark-aqua" : "gray-200"} bg-${alternate ? "aqua" : "gray-50"}`;

    let compoundedClassName = `flex gap-12 ${flexDirection} ${padding} ${colorStyling} rounded-xl items-center`;


    return (
        <div className={compoundedClassName}>
            {
                alternate ?
                    (
                        <>
                            <Image className="w-fit md:w-1/2" src={illustration} alt="" width={300} height={300} />
                            <div className="text-black">
                                <p className="uppercase text-2xl font-medium">{tagline}</p>
                                <p className="text-base">{description}</p>
                            </div>
                        </>
                    ) :
                    (
                        <>
                            <div className="text-black">
                                <p className="uppercase text-2xl font-medium">{tagline}</p>
                                <p className="text-base">{description}</p>
                            </div>
                            <Image className="w-fit md:w-1/2" src={illustration} alt="" width={300} height={300} />
                        </>
                    )
            }
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
            </Container>
        </div>
    )
}

