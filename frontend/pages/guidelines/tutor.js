import Link from "next/link";
import Container from "../../components/Container";

const FAQ = () => {
    return (
        <Container className="p-6 max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold">Tutor guidelines</h1>
                <p className="text-xl">Role models of our younger generation</p>
            </div>


            <main className="py-8 leading-relaxed">
                <p className="py-2">
                    As volunteers of EduHope, we expect tutors to{" "}
                    <strong>serve the community in good faith</strong>,
                    to coach tutees irregardless of their backgrounds and
                    most importantly, to{" "}<strong>serve with an open heart
                        and mind.</strong>
                </p>
                <p className="py-2">
                    First and foremost, it is important that tutors should be well
                    prepared prior to each tutoring session. Tutors are expected to
                    {" "}<strong>be knowledgable in the subject they are tutoring.</strong>{" "}
                    Tutors may not have stellar results in the past, but are expected to
                    {" "}<strong>read lesson contents before every tutoring sessions.</strong>
                    {" "}This is to ensure a smooth conduct prior to each session.
                </p>
                <p className="py-2">
                    It is also important that you take note of your tutees' flaws and weakeness,
                    and always try to {" "}<strong>be creative when explaning tough concepts.</strong>{" "}
                    Be attentive, and also encourage tutees to{" "}<strong>think out of the box.</strong>
                </p>
                <p className="py-2">
                    Some tutees may be playful, or disruptive during lessons. Do try to instill discipline using
                    methods such as:{" "}<strong>enforcing deadlines for homeworks,</strong>{" "}using a harsher tone
                    when students are getting playful. However,{" "}<strong><u>do not resort to ANY forms of corporal
                        punishment</u></strong>{" "} even if tutees does not coorporate with you.
                </p>
                <p className="py-2">
                    Instead, do contact EduHope via <Link href="/contact" className="link" passHref>Message Us!</Link>{" "}.
                    You are also encourage to interact with the tutees' parents to share with them tutees' learning progress.
                </p>
                <div className="py-2">
                    <p>
                        It is crucial to follow the guidelines regarding the privacy, respect,
                        and confidentiality of tutees and members of this platform.
                    </p>
                    <ul className="list-inside list-decimal flex flex-col gap-2 ml-8">
                        <li>
                            Be sure to obtain permission before taking any
                            photos or videos involving your tutee or other members.
                        </li>
                        <li>
                            Keep your tutee's contact details confidential,
                            unless permission has been granted.
                        </li>
                        <li>
                            Do take note that you have also consented to display your
                            school, level of education, subjects you tutor, number
                            of tutees you can take up, preferred mode of communication and 
                            special description in EduHope managed spreadsheet for tutees 
                            to choose their tutors.
                        </li>
                    </ul>
                </div>
                <p className="py-2">
                    Lastly, to ensure that this platform is efficient for others,
                    if you no longer wish to volunteer as a tutor,
                    inform EduHope and{" "}
                    <Link href="/" className="link" passHref>withdraw</Link>{" "}
                    from the service so that we can reassign a new tutor to the tutee, so as to
                    minimise disruption to their learning progress.
                </p>
                <p className="py-2">
                    By adhering to these guidelines, you can ensure a positive
                    and fruitful experience with your tutee and the platform.
                </p>
            </main>
        </Container>
    )
}

export default FAQ;