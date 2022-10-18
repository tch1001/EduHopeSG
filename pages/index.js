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
      <div className={styles.profile}><Link href="/"><a className={styles.otherprof}>BACK</a></Link><Link href="/"><a className={styles.otherprof}><br/>BACK</a></Link><Link href="/"><a className={styles.otherprof}>BACK</a></Link><Link href="/"><a className={styles.otherprof}>BACK</a></Link><Link href="/"><a className={styles.profc}>BACK</a></Link></div>
     
      <iframe className="full" width='100%' height='1000px' src='https://iamsven2005.github.io/horizontal/test2.html' frameborder='0' allowFullScreen ></iframe>
    </body>
    
  )
}

