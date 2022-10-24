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
      <div className={styles.tabs}>
	<input className={styles.input} type="radio" name="tabs" id="tabone" checked="checked"></input>
	<label className={styles.label} for="tabone">TUTEE FAQ</label>
	<div className={styles.tab} >
	  <h1>What to expect?</h1>
	  <h3>Is this programme free?</h3>
    <p>Yes, it is free forever. We do not start charging after a few lessons, nor do we run a freemium model. It is completely free for all.</p>

    <h3>Why are the crash courses and sharing of notes on a 1-to-1 basis?</h3>
<p>Crash courses/topical revisions: This format retains the usefulness of courses while relieving the load for tutors. This is because tutors do not feel pressured to make polished slides meant for an audience.</p>

<p>Sharing of notes: Tutors may be uncomfortable sharing their high effort notes to everyone. In a 1-to-1 setting, the tutor is likely to feel more comfortable as they know their tutee, and the notes complement consultations/crash courses.</p>

<h3>How am I paired with my tutor?</h3>
<p>Firstly, we consider the subjects you indicated you require help in. Secondly, we aim to provide as many tutees as possible with one of their top 3 choices. Lastly, should there be multiple tutees requesting the same tutor, tutees with more comprehensive study plans will be paired with the tutor.</p>

<h3>What subjects must I take?</h3>
<p>All subjects in secondary school and Junior College are welcome.,</p>

<h3>How is the tuition conducted?</h3>
<p>It is up to the agreement between tutors and tutees. You may choose to only communicate via Telegram, through virtual consultations or a mix of both. It depends on what is most convenient for you and your tutor.</p>

<h3>When are the tuition sessions?</h3>
<p>Should you choose to have virtual consultations, the dates and timings are flexible. Feel free to work out with your tutor on the most convenient timings.</p>

<h3>What if my tutor does not answer my questions promptly?</h3>
<p>Please give your tutor some time to respond. Should your tutor not reply to queries within 3 days, feel free to let us know and we will look into the situation.</p>

<h3>How do I know that my tutor is qualified?</h3>
<p>We take into account feedback from tutees to ensure that our tutors are of the highest quality, not hesitating to remove them if necessary.</p>

<h3>Can I extend my participation beyond 4 weeks?</h3>
<p>Yes, at the end of the cycle, we will send you an email for you to “renew” your subscription. We will try to match you to the same tutor. However, should they no longer be volunteering with us, we will match you with another qualified tutor.</p>

<h3>When will I know my pairing?</h3>
<p>We will release all pairings by 10 September 2359. Should you not hear from us by then, feel free to drop us an email at eduhopesg@gmail.com.</p>

	</div>
	
	<input className={styles.input} type="radio" name="tabs" id="tabtwo"></input>
	<label className={styles.label} for="tabtwo">TUTOR FAQ</label>
	<div className={styles.tab}>
	  <h1>LETS TEACH</h1>
    <h3>How is the tuition conducted?</h3>
<p>It is up to the agreement between tutors and tutees. You may choose to only communicate via text, through virtual consultations or a mix of both. It depends on what is most convenient for you and your tutee.</p>

<h3>When are the tuition sessions?</h3>
<p>Should you and your tutee choose to have virtual consultations, the dates and timings are flexible. Feel free to work out with your tutee on the most convenient timings.</p>

<h3>How long must I commit each week?</h3>
<p>This varies depending on the needs of the tutee. However, we recommend that tutors commit no more than 1.5 hours per week per tutee.</p>

<h3>What is the minimum commitment period?</h3>
<p>1 month. This is to ensure continuity in the help rendered while providing interested tutors a chance to try out teaching.</p>

<h3>Will I receive anything after completing my volunteer service?</h3>
<p>When requested, volunteers will receive an e-certificate recognising them for their contributions.</p>

<h3>Can I extend my commitment in the future?</h3>
<p>Yes, you are most welcome to!</p>
	</div>
	
	<input className={styles.input} type="radio" name="tabs" id="tabthree"></input>
	<label className={styles.label} for="tabthree">EXCO FAQ</label>
	<div className={styles.tab} >
	  <h1>Tab Three Content</h1>
	  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
	</div>
  </div>
    </body>
    
  )
}
