import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdsProvider } from "@/context/AdsContext"; 

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AdsProvider> 
      <Head>
        <title>Haunter Store</title>
      </Head>

      <Component {...pageProps} />

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AdsProvider> 
  );
}