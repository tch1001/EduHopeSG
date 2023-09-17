import Container from "../components/Container";

const Terms = () => {
    return (
        <Container className="p-6 max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold">Terms and conditions</h1>
                <p className="text-xl">
                    By using EduHopeSG's services ("EduHopeSG", "EduHope"), you agree to abide
                    by these terms. Failure to comply with these terms may{" "}
                    <strong> result in the termination</strong>{" "}
                    of your access to the service.
                </p>
            </div>
            <main className="flex flex-col gap-6 py-8 leading-relaxed">
                <ol className="list-outside list-[lower-roman] flex flex-col gap-4">
                    <li>
                        <strong>Privacy of Tutors and Members:</strong>{" "}
                        You must have permission before taking any photos or videos
                        involving them.
                    </li>
                    <li>
                        <strong>Respect for Tutors and Members:</strong>{" "}
                        Treat your tutor and other users on this platform with
                        respect. You will be held accountable for any form of
                        harassment (verbal, sexual, physical, etc.),
                        including but not limited to, making offensive remarks and
                        transmitting inappropriate messages.
                    </li>
                    <li>
                        <strong>Confidentiality of Contact Details:</strong>{" "}
                        Keep your tutor's contact details confidential, unless
                        permission has been granted.
                    </li>
                    <li>
                        <strong>Use of Personal Data:</strong>{" "}
                        Personal data you have disclosed to EduHopeSG
                        may be made available to relevant core team members for
                        the purposes of contacting yourself and for event organisation.
                        Examples of such instances include, but are not limited to,
                        phone calls or video conferences, text messages,
                        and emails regarding details for future events.
                    </li>
                </ol>
            </main>
        </Container>
    )
}

export default Terms;
