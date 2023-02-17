import { useRouter } from 'next/router'
import Link from 'next/link'

export const Subject = ({ subject }) => {
    const router = useRouter();
    const { stream } = router.query;
    
    return (
        <body>
            <p>{stream}</p>
            <p>meow</p>
        </body>
    )
}


export const getServerSideProps = async ({ params }) => {
    // const req = await fetch(`http://localhost:3000/${params.stream}.json`);
    // const data = await req.json();

    return {
        props: {
            subject: []
        }
    }
}

export default Subject;