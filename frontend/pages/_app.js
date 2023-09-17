import Footer from "../components/Footer.jsx"
import Head from "../components/Head.jsx"
import Header from "../components/Header.jsx"
import DialogContext from "../helpers/dialogContext.js"
import { Dialog } from "../components/Dialog.jsx"
import '../styles/globals.css'

function MyApp({ Component: Body, pageProps }) {
    return (
        <>
            <Head />
            <Header />
            <DialogContext>
                <div className="content">
                    <Body {...pageProps} />
                </div>
                <Dialog />
            </DialogContext>
            <Footer />
        </>
    )
}

export default MyApp
