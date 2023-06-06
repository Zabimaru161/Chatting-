import type { NextPage } from "next";
import Head from "next/head";
import Sidebar from "../components/Sidebar";

const Home: NextPage = () => (
  <div>
    <Head>
      <title>Chatting App</title>
      <meta name="description" content="by V" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Sidebar />
  </div>
);

export default Home;
