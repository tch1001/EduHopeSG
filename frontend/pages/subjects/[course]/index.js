import { useRouter } from "next/router";
import Link from 'next/link'

export const CourseSubjects = ({ subjects }) => {
    const router = useRouter();
    const { stream } = router.query;

    return (
        <p>Here is a stream</p>
    )
}

export default CourseSubjects;