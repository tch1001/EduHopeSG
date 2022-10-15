import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import Link from 'next/link'

export default function SUBJECTS({ SUBJECTSr }) {

    const router = useRouter()
    const { id } = router.query
    return (
        <div className={styles.container}>
            <Head>
        <title>EDUHOPE</title>
        <link rel="icon" href="/EDUHOPE.png" />
      </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    {id}
                </h1>
                
                <Link href="/SUBJECTS"><a>BACK</a></Link>
            </main>
            
        </div>
    )
}


export async function getServerSideProps({ params }) {
    const req = await fetch(`http://localhost:3000/${params.id}.json`);
    const data = await req.json();

    return {
        props: { SUBJECTS: data },
    }
}

// export async function getStaticProps({ params }) {

//     const req = await fetch(`http://localhost:3000/${params.id}.json`);
//     const data = await req.json();

//     return {
//         props: { car: data },
//     }
// }

// export async function getStaticPaths() {

//     const req = await fetch('http://localhost:3000/cars.json');
//     const data = await req.json();

//     const paths = data.map(car => {
//         return { params: { id: car } }
//     })

//     return {
//         paths,
//         fallback: false
//     };
// }
