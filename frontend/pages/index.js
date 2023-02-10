import Image from "next/image";
import { useEffect, useState } from "react";
import { Card } from "../components/card";

export default function Home() {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const updateWidth = () => setWidth(window.innerWidth)
        
        updateWidth();
        window.addEventListener("resize", updateWidth);
    });

    return (
        <div>
            {/* <div
                className="bg-contain xl:bg-cover resize bg-no-repeat opacity-80 align-middle"
                style={{
                    backgroundImage: `url(${landing_page.src})`,
                    height: "calc(100vh - 61px)",
                }}
            >
                <div className="pt-[22vw] flex flex-col gap-1 m-auto text-white text-center text-3xl">
                    <p className="uppercase font-bold">Connect, Learn and Grow</p>
                    <p>Empowering students through free and flexible tutoring.</p>
                </div>
            </div> */}
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
        </div>
    )
}

