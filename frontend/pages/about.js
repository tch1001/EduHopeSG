import Link from "next/link";
import Container from "../components/Container";

const About = () => {
    return (
        <Container className="p-6 max-w-5xl">
            <div>
                <h1 className="text-3xl font-bold">About Us</h1>
                <p className="text-xl">
                    Non-profit peer-to-peer consultation platform started{" "}
                    <span className="text-dark-blue underline font-medium">by students, for students.</span>
                </p>
            </div>
            <main className="flex flex-col gap-12 py-8">
                <div>
                    <h2 className="text-2xl ">Our Mission</h2>
                    <p>
                        To leverage peer-to-peer consultations to provide a more affordable option for
                        students who may not have access to traditional tutoring services due to financial
                        or other limitations.
                    </p>
                </div>
                <div>
                    <h2 className="text-2xl ">Our Story</h2>
                    <p>
                        EduHope was started by a group of four A-level graduates from RI and HCI.
                        We noticed how the high cost of good-quality tuition puts many groups in society at
                        a disadvantage and saw a need for a more affordable option for students.
                        Additionally, we realized that not all students require full-blown academic
                        tuition and sometimes, all that is needed is a friendly person to answer
                        occasional queries.
                    </p>
                </div>
                <div>
                    <h2 className="text-2xl ">Our Philosophy</h2>
                    <p>
                        We aim to provide a solution to this problem by connecting students in need
                        with their students to volunteer tutors who are passionate about giving back
                        to their fellow students, communities and society.
                    </p>
                </div>
                <div>
                    <h2 className="text-2xl ">A win-win</h2>
                    <p>
                        Our project provides a way for those who want to give back to the community
                        but may not have the time to create detailed lesson plans and materials,
                        while also providing students with an opportunity to seek academic
                        advice outside of their schools.
                    </p>
                </div>
                <div>
                    <h2 className="text-2xl ">Who can benefit?</h2>
                    <p>
                        Our services are open to all secondary school students and JC students
                        and can be conducted both virtually and face-to-face.
                        Each consultation is one-on-one, and tutees can renew their subscription
                        for longer periods.
                    </p>
                </div>
                <div>
                    <h2 className="text-2xl ">Our Team</h2>
                    <p>
                        
                    </p>
                </div>
                <div>
                    <h2 className="text-2xl ">Partnerships</h2>
                    <p>
                        This project is in partnership with the{" "}
                        <Link className="link" href="https://www.msf.gov.sg" target="_blank" passHref>
                            Ministry of Social and Family Development
                        </Link>.
                        They help us in referring students in need and also give us advice on how
                        we should collaborate with other government bodies.
                        We are also looking at working with the{" "}
                        <Link className="link" href="https://www.moe.gov.sg" target="_blank" passHref>
                            Ministry of Education
                        </Link>
                        {" "}in the future to help us spread the word around to Secondary and JC students
                        who may be interested in joining as a volunteer tutor for VIA hours.
                    </p>
                </div>
                <div>
                    <h2 className="text-2xl ">Join us</h2>
                    <p>
                        
                    </p>
                </div>
                Thank you for your support -- EduHope Team
            </main>
        </Container>
    )
}

export default About;