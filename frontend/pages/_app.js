import Head from "../src/head.jsx"
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
