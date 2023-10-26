import Providers from "@/partials/Providers";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Head>
        <title>My Contabilidade</title>
      </Head>
      <Component {...pageProps} />
    </Providers>
  );
}
