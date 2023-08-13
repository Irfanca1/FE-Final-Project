import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import Navbar from '@/components/Navbar';
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';
import Payment from '@/components/Payment';

const inter = Inter({ subsets: ['latin'] });

export default function Pembayaran(props) {
  return (
    <>
      <Head>
        <title>Detail Penerbangan One Way</title>
      </Head>
      <Navbar accessToken={props.accessToken} username={props.username} />
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}>
          <Payment accessToken={props.accessToken} />
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
