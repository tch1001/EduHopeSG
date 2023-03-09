import Link from 'next/link'
import Container from "../components/Container";

export default function Home() {
    return (
        <Container className="p-6 max-w-5xl">
            <div>
                <h1 className="text-3xl font-bold">Contact us</h1>
                <p className="text-xl">Various avenues for reaching out to us!</p>
            </div>
            <main className="flex flex-col gap-12 py-8">
            </main>
        </Container>
    )
}


// <p><a href="https://forms.gle/go6DKruGaZUyQwLp9">TUTEE SIGNUP</a></p>
// <p><a href="https://forms.gle/rGfEasoyakNT4oMb8">TUTOR SIGNUP</a></p>
// <p><a href="https://forms.gle/1URf8q3MxHeFzefF9">EXCO SIGNUP</a></p>

{/* <div className={styles.tab} >
    <h1>HOW WE WORK</h1>
    <div className={styles.linebreakau}></div>
    <p>EDUHOPE is a team of volunteers dedicated towards improving the learning experience. Through EDUHOPE, resources can be shared within and across student communities, enabling users to access and build upon a peer-to-peer learning environment. We believe that by facilitating such communal, generational learning, we can help close the loop between students and alumni, creating a learning cycle that grows with each new class of students, rather than simply repeating itself each year.</p>
    <div className={styles.linebreakau}></div>
    <h1>DISCLAIMER</h1>
    <div className={styles.linebreakau}></div>
    <p>Here at EDUHOPE, we crowdsource our resources to make sure you get access to as many resources as possible to support your education. What this means is that these resources could be made by anyone - yes, literally anyone - be it peers, teachers, or seniors who have studied your subjects before you. While our Quality Control team works hard to ensure that the resources updated conform to our quality standards, there are bound to be oversights and errors so use the resources with discretion. That said, if you notice any errors or have doubts about the content, please leave a comment, contact the contributors (if their details are available), or get in touch with us at eduhopesg@gmail.com.</p>
    <div className={styles.linebreakau}></div>
    <h1>TERMS OF USE</h1>
    <div className={styles.linebreakau}></div>
    <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the website (the "Service") operated by EDUHOPE ("us","we", or "our").</p><br></br>
    <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.</p><br></br>
    <p>By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.</p><br></br>
    <p>EDUHOPE reserves all rights not expressly granted in these Terms of Service.</p>
    <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 15 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p><br></br>
    <p>By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.</p><br></br>
    <h2>GOVERNING LAW</h2>
    <p>These Terms shall be governed and construed in accordance with the laws of Singapore, without regard to its conflict of law provisions.</p><br></br>
    <p>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service, and supersede and replace any prior agreements we might have between us regarding the Service.</p><br></br>
    <h2>TERMINATION</h2>
    <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p><br></br>
    <p>All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.</p><br></br>
    <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p><br></br>
    <p>Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.</p><br></br>
    <p>All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.</p><br></br>
    <h2>INDEMNIFICATION</h2>
    <p>You agree to indemnify, save, and hold eduhope, its affiliated companies, contractors, employees, agents and its third-party suppliers, licensors, and partners harmless from any claims, losses, damages, liabilities, including legal fees and expenses, arising out of Your use or misuse of the eduhope platform, any violation by You of these Terms, or any breach of the representations, warranties, and covenants made by You herein. eduhope
        reserves the right, at Your expense, to assume the exclusive defense and control of any matter for which You are required to indemnify eduhope, and You agree to cooperate with eduhope defense of these claims. eduhope will use reasonable efforts to notify You of any such claim, action, or proceeding upon becoming aware of it.</p><br></br>
    <h2>CONTRIBUTIONS</h2>
    <p>The EDUHOPE Platform is a peer-to-peer service that allows users to contribute resources to a globally accessible platform, and EDUHOPE claims no ownership of the content uploaded. Users declare full ownership of any resource uploaded to the EDUHOPE Platform and that they are neither infringing on copyright nor contravening on any Intellectual Property laws to the best of their knowledge. EDUHOPE does not support or condone the
        contribution of resources not owned by the parties uploading them, and bears no responsibility over such content. Should complaints or removal requests be lodged by members of the community, EDUHOPE reserves the right to conduct independent investigations and remove content contributed by the User. See section on indemnification.</p><br></br>
    <h2>CONTENT</h2>
    <p>You understand that when using the EDUHOPE Platform that You will be exposed to content from a variety of sources, and that EDUHOPE is not responsible for the accuracy, usefulness, or intellectual property rights of or relating to such content. You further understand and acknowledge that You may be exposed to content that is inaccurate, offensive, indecent or objectionable, and You agree to waive, and hereby do waive, any legal or equitable
        rights or remedies You have or may have against Tick with respect thereto. Tick does not endorse any content or any opinion, recommendation, or advice expressed therein, and Tick expressly disclaims any and all liability in connection with such content. If notified by a User or a content owner of content that allegedly does not conform to these Terms, Tick may investigate the allegation and determine in its sole discretion whether to remove
        the content, which it reserves the right to do at any time and without notice. For clarity, Tick does not permit copyright infringing activities on the Tick platform.</p><br></br>
    <h2>LINKS</h2>
    <p>Our Service may contain links to third-party web sites or services that are not owned or controlled by Tick.

        EDUHOPE has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that EDUHOPE shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.

        We strongly advise you to read the terms and conditions and privacy policies of any third-party web sites or services that you visit.</p>
    <div className={styles.linebreakau}></div>
    <h3>If you have any questions about these Terms, please contact us at <a href="eduhopesg@gmail.com.">eduhopesg@gmail.com</a>.</h3>
</div> */}