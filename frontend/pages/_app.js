import Head from "../src/components/head.jsx"
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <body>
      <Head />
      <Component {...pageProps} />
    </body>
  )
}

export default MyApp
