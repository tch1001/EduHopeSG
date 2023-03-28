import Footer from "../components/Footer.jsx"
import Head from "../components/Head.jsx"
import Header from "../components/Header.jsx"
import '../styles/globals.css'

function MyApp({ Component: Body, pageProps }) {
    return (
        <>
            <Head />
            <Header />
            <div className="content">
                <Body {...pageProps} />
            </div>
            <Footer />
        </>
    )
}

export default MyApp
