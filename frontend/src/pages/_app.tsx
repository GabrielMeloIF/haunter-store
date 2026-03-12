import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <div className="bg-[#303030] min-h-screen">
      <Head>
        <title>Haunter Store</title>
      </Head>
      <Component {...pageProps} />
      </div>
    </>
  );
}