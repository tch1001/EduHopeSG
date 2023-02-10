import { Footer } from "../components/footer.jsx"
import { HeadProperties as Head } from "../components/head.jsx"
import { Header } from "../components/header.jsx"
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
