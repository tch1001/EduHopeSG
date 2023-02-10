import landing_page from "../public/landing_page.jpg";
import { Card } from "../components/card";

export default function Home() {
    return (
        <div>
            {/* <Image
                src="/landing_page.jpg"
                className="w-screen h-fit object-cover"
                style={{ height: "calc(100vh - 61px)" }}
                width={width}
                height={width}
                quality={100}
                alt=""
            /> */}
            <div
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
            </div>
        </div>
    )
}

