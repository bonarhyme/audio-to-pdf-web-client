import Head from "next/head";
import SpeechToText from "../components/SpeechToText";

export default function Home() {
  return (
    <div className="home">
      <Head>
        <title>Audio To PDF</title>
        <meta
          name="description"
          content="An app that converts audio to pdf in the browser"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Convert your speech to pdf</h1>

      <main>
        <SpeechToText />
      </main>
    </div>
  );
}
