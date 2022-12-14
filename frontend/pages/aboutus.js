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
      <section>
      <div className={styles.titleau}>
        <h3>EDUHOPE</h3><br></br><br></br>
        <h1>ABOUT US</h1>
      </div>
    </section>
    
    <section>
        <div className={styles.oneau}>
          <h2 className={styles.hau}>A non-profit peer-to-peer consult project</h2>
        </div>
    </section>
    
    <section>
      <div className={styles.blockau}>
        <p><span className={styles.firstau}>H</span>ello everyone! We are project EduHope, a group of four A-level graduates from RI and HCI. This project hopes to leverage peer-to-peer consults to provide a more affordable option for students.</p>
        <p className={styles.linebreakau}></p>
        <p className={styles.marginau}>It first started when we saw how the cheapest tuition rates go for tens of dollars per hour, which means that many are left out by virtue of their inability to pay.</p>
      </div>
    </section>
    
    <section>
      <div className={styles.twoau}>
        <h2 className={styles.hau}>Our belief</h2>
      </div>
    </section>
    
    <section>
      <div className={styles.blockau}>
        <p><span className={styles.firstau}>W</span>e believe that this put it out of reach of many groups in society, from students from underprivileged backgrounds to others who may have been affected by the pandemic. Is that really fair? Is that how it should be?</p>
        <p className={styles.linebreakau}></p>
        <p className={styles.marginau}>Additionally, we realised that many students do not require full-blown academic tuition, such as high quality notes and prepared lessons. Sometimes, what we need is just a friendly person to answer our occasional queries. At the same time, we hope to create a way for those who want to give back but don???t have the time to create detailed lesson plans and materials.</p>
      </div>
    </section>
    
    <section>
      <div className={styles.threeau}>
        <h2 className={styles.hau}>More info</h2>
      </div>
    </section>
    
    <section>
      <div className={styles.blockau}>
        <p><span className={styles.firstau}>E</span>DUHOPE is a team of volunteers dedicated towards improving the learning experience. Through EDUHOPE, resources can be shared within and across student communities, enabling users to access and build upon a peer-to-peer learning environment. We believe that by facilitating such communal, generational learning, we can help close the loop between students and alumni, creating a learning cycle that grows with each new class of students, rather than simply repeating itself each year.</p>
        <p className={styles.linebreakau}></p>
        <p className={styles.marginau}>
        <h3>Tutor benefits ??? </h3>joy from helping and giving back!<br></br>
        Details:

            Open to all secondary school (taking O Lvls) and JC students (taking A Lvls)<br></br>
            Will last for one month (around 4 sessions). Volunteers can sign up for a longer duration, but tutees will have to ???renew??? their subscription<br></br>
            1-1 sessions<br></br>
            Virtual consults</p>
            <p className={styles.linebreakau}></p>
          <h3>Tutee benefits ??? </h3>free and flexible consultations!<br></br>
        <ul>
          <li>Form meaningful relationships!</li>
          <li>Seek advice outside of academics!</li>
          <li>Learn from the young veterans (they have A for A levels and A1 for O level subjects)!</li>
        </ul>
        <p>Why should you volunteer?

Do <em>YOU</em> believe in our vision? Do <em>YOU</em> want to help people without spending so much time preparing materials? Then this just the thing for <em>YOU!</em><br></br>We believe in the power of free peer-to-peer consults in creating a more affordable option for students.</p>
      </div>
      
    </section>
    <p className={styles.linebreakau}></p>
    <h1 className={styles.hau}>???The most selfish thing you can do in this world is help someone else, because the gratification, the goodness that comes to you, the good feeling, the good feeling from helping others???nothing is better than that.??? </h1><h3>-Denzel Washington, Academy Award Actor</h3>
    </body>
    
  )
}