import { Footer } from "../components/Footer.jsx"
import { HeadProperties as Head } from "../components/Head.jsx"
import { Header } from "../components/Header.jsx"
import '../styles/globals.css'

function MyApp({ Component: Body, pageProps }) {
    return (
        <>
            <Head />
            <Header />
            <Body {...pageProps} />
            <Footer />
        </>
    )
}

export default MyApp
