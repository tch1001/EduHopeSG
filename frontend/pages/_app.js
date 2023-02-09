import { Footer } from "../components/footer.jsx"
import { HeadProperties as Head } from "../components/head.jsx"
import { Header } from "../components/header.jsx"
import '../styles/globals.css'

function MyApp({ Component: Body, pageProps }) {
    return (
        <>
            <Head />
            <Header />
            <div className="container mx-auto px-4">
                <Body {...pageProps} />
            </div>
            <Footer />
        </>
    )
}

export default MyApp
