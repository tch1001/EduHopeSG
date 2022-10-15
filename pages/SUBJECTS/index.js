
import Link from 'next/link'
import styles from '../../styles/Home.module.css'

export default function SUBJECTSList(props) {
  return (
    <div className={styles.container}>
        <h1 className={styles.title}>
            MAIN SUBJECTS 
           <hr></hr>
        </h1>
        <ul>
        
          <li className={styles.btn}>
          <h2>O levels</h2><Link  href="/SUBJECTS/MATHEMATICS(H2)"><a className={styles.btn2}> MATHEMATICS(H2)</a></Link><h3>DESCIRPTION</h3>
          </li>
          <li className={styles.btn}>
          <h2>A levels</h2><Link href="/SUBJECTS/CHEMISTRY(H2)"><a className={styles.btn2}> CHEMISTRY(H2)</a></Link><h3>DESCIRPTION</h3>
          </li>
          <li className={styles.btn}>
          <h2>Both</h2> <Link href="/SUBJECTS/ENGLISH"><a className={styles.btn2}>ENGLISH</a></Link><h3>DESCIRPTION</h3>
          </li>
        </ul>
        <hr></hr>
        <Link href="/"><a>BACK</a></Link>
    </div>
    
  )
  }
    
