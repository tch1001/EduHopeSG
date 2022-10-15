import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import Link from 'next/link'

export default function SUBJECTS({ SUBJECTS }) {

    const router = useRouter()
    const { id } = router.query
    return (
        <div className={styles.container}>
            <Head>
        <title>EDUHOPE</title>
        <link rel="icon" href="/EDUHOPE.png" />
      </Head>

            <main className={styles.main}>
            <div className={styles.borderblue}>
                <h1 className={styles.title}>
                    {id}
                </h1>
                <div className={styles.SUBJECTSpage}>
                <p>{id}</p>
                <p>Other:{SUBJECTS.Other}</p>
                <p>Medium:{SUBJECTS.Medium}</p>
                <p>Education:{SUBJECTS.Education}</p>
                <p>Description:{SUBJECTS.Description}</p>
                </div>
                <Link href="#"><a className={styles.signup}><h1>SIGN UP NOW</h1></a></Link>
            </div>
                <Link href="/SUBJECTS"><a className={styles.backbtn}>BACK</a></Link>
                
                <br>

                </br>
            </main>
            <hr></hr>
            <div className={styles.Profiles}><h3>See Similar Profiles:</h3></div>
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
