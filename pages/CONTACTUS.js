import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (

    <body className={styles.body2}>
      <Head>
        <link rel="icon" href="/EDUHOPE.png" />
        <title>Contact us</title>
<link href="https://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,500,700,800" rel="stylesheet" type="text/css"></link>
 <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"></link>
 <link rel="stylesheet" href="path/to/font-awesome/css/font-awesome.min.css"></link>
 <link rel="stylesheet" href="https://fontawesome.com/v4/assets/font-awesome/css/font-awesome.css"></link>
 <link rel="stylesheet" href="https://fonticons-free-fonticons.netdna-ssl.com/kits/ffe176a3/publications/72113/woff2.css"></link>
 <link rel="stylesheet" href="https://fontawesome.com/v4/assets/css/pygments.css"></link>


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
  <iframe src='https://my.spline.design/superkidrobotcopy-d9113a7280fd40fdc29a15abe4be23d4/' frameborder='0' width='1000px' height='1000px'></iframe>
               </body>
    
  )
}
