import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (

    <body className={styles.body2}>
      <Head>
      <title>EDUHOPE</title>
        <link rel="icon" href="/EDUHOPE.png" />
</Head>
      <div className={styles.profile}><Link href="/"><a className={styles.profc}>BACK</a></Link><Link href="/tuteefaq"><a className={styles.otherprof}>Tutee FAQ</a></Link><Link href="/tutorfaq"><a className={styles.otherprof}>Tutor FAQ</a></Link><Link href="/"><a className={styles.otherprof}>SUBJECTS</a></Link><Link href="/aboutus"><a className={styles.otherprof}>ABOUT US</a></Link></div>
     
      <iframe className={styles.iframe} height='1000px' src='https://iamsven2005.github.io/horizontal/test2.html' frameborder='0' allowFullScreen ></iframe>
    </body>
    
  )
}

