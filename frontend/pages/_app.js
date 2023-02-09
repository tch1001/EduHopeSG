import { Footer } from "../components/footer.jsx"
import Head from "../components/head.jsx"
import { Header } from "../components/header.jsx"
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head />
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  )
}

export default MyApp
