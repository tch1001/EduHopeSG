import Container from "../components/Container";
import Accordion from "../components/Accordion";

const FAQ = ({ tuteeFAQ, tutorFAQ }) => {
    return (
        <Container className="p-6 max-w-5xl">
            <div>
                <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
                <p className="text-xl">Our answers for both prospective tutees and tutors' questions</p>
            </div>
            <main className="flex flex-col gap-12 py-8">
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-bold">Tutee FAQ</h2>
                    <Accordion items={tuteeFAQ} />
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-bold">Tutor FAQ</h2>
                    <Accordion items={tutorFAQ} />
                </div>
            </main>
        </Container>
    )
}

export const getStaticProps = async () => {
    const transform = (object) => JSON.parse(JSON.stringify(object));
    const faq = transform(await import("../data/faq.json"));

    return {
        props: {
            tuteeFAQ: faq.tutee,
            tutorFAQ: faq.tutor
        }
    }
}

export default FAQ;
