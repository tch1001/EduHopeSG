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

      <div className={styles.profile}><Link href="/"><a className={styles.profc}>BACK</a></Link><Link href="/FAQ"><a className={styles.otherprof}>FAQ</a></Link><Link href="/CONTACTUS"><a className={styles.otherprof}>CONTACT US</a></Link><Link href="/SUBJECTS"><a className={styles.otherprof}>SUBJECTS</a></Link><Link href="/aboutus"><a className={styles.otherprof}>ABOUT US</a></Link></div>
     <div className={styles.spacetab}></div>
     <h1>CONTACT US</h1>
     <p><a href="eduhopesg@gmail.com">eduhopesg@gmail.com</a></p>
     <h1>JOIN US TODAY</h1>
     <div className={styles.sectionbtn}>
	<p><a className={styles.abtn}href="https://forms.gle/go6DKruGaZUyQwLp9">TUTEE SIGNUP</a></p><br></br>
  <div className={styles.spacer}></div>
  <p><a className={styles.abtn}href="https://forms.gle/rGfEasoyakNT4oMb8">TUTOR SIGNUP</a></p><br></br>
  <div className={styles.spacer}></div>
  <p><a className={styles.abtn}href="https://forms.gle/1URf8q3MxHeFzefF9">EXCO SIGNUP</a></p>  
  </div>
               </body>
    
  )
}
