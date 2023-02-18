import Link from "next/link";
import Image from "next/image";
import Container from '../../../../components/Container';
import Card from '../../../../components/Card';

export const Subject = ({ subject }) => {
    return (
        <Container className="p-6 max-w-5xl">
            <div>
                <h1 className="text-3xl font-bold">
                    Showing available{" "}
                    <span className="underline text-dark-blue">{subject}</span>
                    {" "}subjects
                </h1>
                <p className="text-xl">Select the subject that you require help with</p>
            </div>
        </Container>
    )
}

export const getServerSideProps = async ({ query }) => {
    // get tutor info
    return {}
}

export default Subject;