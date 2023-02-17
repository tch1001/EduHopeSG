import { useRouter } from 'next/router'
import Link from 'next/link'

export const SubjectsStream = ({ subjects }) => {
    const router = useRouter();
    const { stream } = router.query;
    
    return (
        <body>
            <p>{stream}</p>
            <p>This is the main page for this</p>
        </body>
    )
}

export default SubjectsStream;