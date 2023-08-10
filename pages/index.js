import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import HalamanUtama from '@/components/Home';
import Navbar from '@/components/Navbar';
import Header from '@/components/Home/header';
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';

const inter = Inter({ subsets: ['latin'] });

export default function Home(props) {
  return (
    <>
      <Head>
        <title>Halaman Utama</title>
      </Head>
      <Navbar accessToken={props.accessToken} username={props.username} />
      <Header />
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}>
          <HalamanUtama />
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const accessToken = req.cookies.accessToken || null;
  const username = req.cookies.username || null;

  return {
    props: {
      accessToken,
      username,
    },
  };
}
