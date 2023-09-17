import Link from "next/link";
import Container from "../../components/Container";

const FAQ = () => {
    return (
        <Container className="p-6 max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold">Tutee guidelines</h1>
                <p className="text-xl">You play a part in shaping everyone's experience</p>
            </div>
            <main className="py-8 leading-relaxed">
                <p className="py-2">
                    As a tutee using this platform, there are several guidelines
                    that you should follow to ensure that you have a{" "}
                    <strong>productive and positive learning experience</strong>.
                </p>
                <p className="py-2">
                    First and foremost, it is essential that you are{" "}
                    <strong>punctual and show up on time</strong>{" "}
                    for your scheduled consultation sessions.
                    This not only demonstrates your respect for your tutor's time
                    but also ensures that you have enough time to go over your
                    academic concerns and receive the help you need.
                </p>
                <p className="py-2">
                    To make the most out of your consultation sessions, it is
                    highly recommended that you{" "}
                    <strong>come prepared with specific questions or
                    areas of study that you want to focus on</strong>.
                    By doing so, you can ensure that your tutor can address
                    your concerns more efficiently and effectively.
                </p>
                <p className="py-2">
                    Moreover, it is essential to{" "}
                    <strong>be open and honest with your tutor about your academic needs and goals</strong>.
                    Communication is key,
                    and by providing your tutor with a clear understanding of
                    what you hope to achieve through their assistance, they can
                    tailor their approach to your learning style and needs.
                </p>
                <p className="py-2">
                    During the consultation session, it is important to{" "}
                    <strong>actively listen to your tutor and ask questions</strong>
                    {" "}if you don't understand something. Remember that you are
                    responsible for your own learning and progress, so take
                    an active role in the process.
                </p>
                <p className="py-2">
                    Furthermore, it is essential to respect your tutor's time and be
                    considerate of their efforts to help you.{" "}
                    <strong>Avoid any disruptive or inappropriate behavior</strong>
                    {" "}during the consultation session and always maintain
                    a professional demeanor.
                </p>
                <p className="py-2">
                    After each session, it is highly recommended that you{" "}
                    <strong>provide feedback to your tutor about the consultation session</strong>
                    {" "}and let them know how they can better assist you
                    in your academic journey.
                </p>
                <div className="py-2">
                    <p>
                        Finally, it is crucial to follow the guidelines regarding the privacy, respect,
                        and confidentiality of tutors and members of this platform.
                    </p>
                    <ul className="list-inside list-decimal flex flex-col gap-2 ml-8">
                        <li>
                            Be sure to obtain permission before taking any
                            photos or videos involving your tutor or other members
                        </li>
                        <li>
                            Treat your tutor and other users with respect,
                            and avoid any form of harassment, including but not
                            limited to, making offensive remarks
                            and transmitting inappropriate messages.
                        </li>
                        <li>
                            Keep your tutor's contact details confidential,
                            unless permission has been granted
                        </li>
                    </ul>
                </div>
                <p className="py-2">
                    Lastly, to ensure that this platform is efficient for others,
                    if you no longer require a tutor's services,
                    inform your tutor and{" "}
                    <Link href="/" className="link" passHref>withdraw</Link>{" "}
                    from the service to avoid wasting time and resources.
                    
                </p>
                <p className="py-2">
                    By adhering to these guidelines, you can ensure a positive
                    and fruitful experience with your tutor and the platform.
                </p>
            </main>
        </Container>
    )
}

export default FAQ;
