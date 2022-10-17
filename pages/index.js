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
      <iframe src='https://iamsven2005.github.io/horizontal/test2.html' frameborder='0' width='100%' height='100%'></iframe>
    </div>
    
  )
}

