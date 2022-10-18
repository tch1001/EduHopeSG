import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import Link from 'next/link'

export default function SUBJECTSList(props) {
  return (
    
    <body className={styles.body}>
    <Head>
        <title>EDUHOPE</title>
        <link rel="icon" href="/EDUHOPE.png" />
      </Head>
      <div className={styles.profile}><Link href="/"><a className={styles.otherprof}>BACK</a></Link><Link href="/"><a className={styles.otherprof}><br/>BACK</a></Link><Link href="/"><a className={styles.otherprof}>BACK</a></Link><Link href="/"><a className={styles.otherprof}>BACK</a></Link><Link href="/"><a className={styles.profc}>BACK</a></Link></div>
     <br></br><br></br>
        <h1 className={styles.title}>
            MAIN SUBJECTS 
           <hr></hr>
        </h1>
          <li className={styles.btn}>
          <h2>O levels</h2><Link  href="/SUBJECTS/MATHEMATICS(H2)"><a className={styles.btn2}> MATHEMATICS(H2)</a></Link><h3>DESCIRPTION</h3><br></br>
          </li>
          <br></br>
          <li className={styles.btn}>
          <h2>A levels</h2><Link href="/SUBJECTS/CHEMISTRY(H2)"><a className={styles.btn2}> CHEMISTRY(H2)</a></Link><h3>DESCIRPTION</h3>
          </li>
          <br></br>
          <li className={styles.btn}>
          <h2>Both</h2> <Link href="/SUBJECTS/ENGLISH"><a className={styles.btn2}>ENGLISH</a></Link><h3>DESCIRPTION</h3>
          </li>
          <br></br>
        <hr></hr>
        <Link href="/"><a className={styles.backbtn}>BACK</a></Link>
        <br></br>
    </body>
    
  )
  }
    
