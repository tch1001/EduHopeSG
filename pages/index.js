import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>EDUHOPE</title>
        <link rel="icon" href="/EDUHOPE.png" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to EDUHOPE See <Link href="/SUBJECTS">SUBJECTS</Link>
        </h1>
       
        </main>
        <h3>
          About Us:
        </h3>
        <p>
          Eduhope story
        </p>
        <iframe width="1280" height="720" src="https://iamsven2005.github.io/horizontal/test.html"  frameborder="0"  allowfullscreen></iframe>
    </div>
  )
}

