import Image from "next/image";
import { Container } from "../components/container";
import { useEffect, useState } from "react";

const BenefitCard = ({ illustration, tagline, description, reversed = false, secondary = false }) => {
    return (
        <div
            className="border boarder-grey-600 bg-white text-black rounded-lg w-full"
        >
            <p className="uppercase text-2xl">{tagline}</p>
            <p className="text-base">{description}</p>
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
                    src="/landing_page.jpg"
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
            <Container center>
                <BenefitCard
                    tagline="Free and flexible consultations"
                    description="Our volunteer tutors are passionate graduates who want you to succeed in your student life!1"
                />

            </Container>
        </div>
    )
}

