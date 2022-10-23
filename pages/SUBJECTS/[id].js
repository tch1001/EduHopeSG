import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import Link from 'next/link'

export default function SUBJECTS({ SUBJECTS }) {

    const router = useRouter()
    const { id } = router.query
    return (
        <body className={styles.body}>
            <Head>
        <title>EDUHOPE</title>
        <link rel="icon" href="/EDUHOPE.png" />
      </Head>
      <div className={styles.profile}><Link href="/"><a className={styles.profc}>BACK</a></Link><Link href="/tuteefaq"><a className={styles.otherprof}>Tutee FAQ</a></Link><Link href="/tutorfaq"><a className={styles.otherprof}>Tutor FAQ</a></Link><Link href="/"><a className={styles.otherprof}>SUBJECTS</a></Link><Link href="/aboutus"><a className={styles.otherprof}>ABOUT US</a></Link></div>
     
            <main className={styles.main}>
            <br></br><br></br><br></br><br></br><br></br>
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
                <Link href="https://forms.gle/KPySJ4Vh7iw6zjqr9" ><a className={styles.signup}><h1>SIGN UP NOW</h1></a></Link>
            </div>
                
                
                <br>

                </br>
            </main>
            
            <div className={styles.Profiles}><hr></hr><h3>See Similar Profiles:</h3><hr></hr></div>
            <div className={styles.profilecontainer}><div className={styles.suggestion}><h3>See Similar Profiles:</h3></div><div className={styles.spacer}></div><div className={styles.suggestion}><h3>See Similar Profiles:</h3></div><div className={styles.spacer}></div><div className={styles.suggestion}><h3>See Similar Profiles:</h3></div></div>
            <Link href="/SUBJECTS"><a className={styles.backbtn}>BACK</a></Link>
        </body>
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
