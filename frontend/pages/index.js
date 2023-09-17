import Image from "next/image";
import Container from "../components/Container";
import TestimonialCard from "../components/home/TestimonialCard";
import Button from "../components/Button";
import { useEffect, useState } from "react";

import styles from "../styles/home.module.css";

const SCROLL_MULTIPLIER = 2;
const LISTENER_OPTIONS = {
    capture: true,
    passive: true
}

const Home = ({ testimonials }) => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        // update cover image width
        updateWidth();
        window.addEventListener("resize", updateWidth, LISTENER_OPTIONS);

        // horizontal scrolling
        const horizontals = [...document.getElementsByClassName(styles["horizontal-scroll"])];

        horizontals.forEach((horizontal) => {
            horizontal.addEventListener("wheel", invertScroll, { ...LISTENER_OPTIONS, passive: false });

            // side scrolling

            let isDown = false;
            let startX;
            let scrollLeft;

            horizontal.addEventListener("mousedown", start, LISTENER_OPTIONS);
            horizontal.addEventListener("mousemove", scroll, { ...LISTENER_OPTIONS, passive: false });
            horizontal.addEventListener("mouseleave", down, LISTENER_OPTIONS);
            horizontal.addEventListener("mouseup", down, LISTENER_OPTIONS);

            function start(e) {
                isDown = true
                startX = e.pageX - horizontal.offsetLeft;
                scrollLeft = horizontal.scrollLeft;

                horizontal.classList.remove("cursor-grab");
                horizontal.classList.add("cursor-grabbing");
            }

            function scroll(e) {
                if (!isDown) return;
                e.preventDefault();

                const x = e.pageX - horizontal.offsetLeft;
                const walk = (x - startX) * SCROLL_MULTIPLIER;
                horizontal.scrollLeft = scrollLeft - walk;
                horizontal.parentElement.scrollTop = x;

                horizontal.classList.remove("cursor-grabbing");
                horizontal.classList.add("cursor-grab");
            }

            function down() {
                isDown = false;

                horizontal.classList.remove("cursor-grabbing");
                horizontal.classList.add("cursor-grab");
            }

            function invertScroll(e) {
                e.preventDefault();
                horizontal.scrollLeft += convertRemToPixels(28) * Math.sign(e.deltaY);
            }
        });

        function convertRemToPixels(rem) {
            return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
        }

        function updateWidth() {
            setWidth(window.innerWidth);
        }
    }, []);

    return (
        <div>
            <div className="relative text-center">
                <Image
                    src="/images/landing_page/cover_banner.jpg"
                    className="w-screen h-fit object-cover"
                    style={{ height: "calc(100vh - 61px)", filter: "brightness(90%)" }}
                    width={width}
                    height={width}
                    quality={80}
                    priority
                    alt=""
                />
                <div className={`${styles.cover} flex flex-col gap-12 m-auto`}>
                    <div className="flex flex-col gap-5 m-auto text-white text-center drop-shadow-[0_5px_5px_rgba(0,0,0,1)]">
                        <p className="font-bold text-5xl">EduhopeSG</p>
                        <p className="text-2xl">Creating a free alternative for students seeking supplementary education.</p>
                    </div>
                    <div className="flex justify-center space-x-10 md:space-x-15 lg:space-x-20 uppercase font-bold text-2xl mx-3">
                        <Button href="/subjects">
                            Find a Tutor!
                        </Button>
                        <Button href="/signup/tutor">
                            Become a Tutor!
                        </Button>
                    </div>
                </div>
            </div>
            <Container className="flex flex-col gap-16 my-16">
                <div className="flex flex-col gap-16">
                    <div className="flex flex-col items-center gap-9">
                        <p className="text-2xl font-semibold">
                            Testimonials from {" "}
                            <span className="text-dark-blue underline">tutors</span>
                        </p>
                        <div className={`${styles["horizontal-scroll"]} pb-4 cursor-grab select-none`}>

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
                            <span className="text-dark-blue underline">tutees</span>
                        </p>
                        <div className={`${styles["horizontal-scroll"]} pb-4 cursor-grab select-none`}>

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

export const getStaticProps = async () => {
    const transform = (object) => JSON.parse(JSON.stringify(object));
    const testimonials = transform(await import("../data/testimonials.json"));

    return {
        props: {
            testimonials
        }
    }
}

export default Home;