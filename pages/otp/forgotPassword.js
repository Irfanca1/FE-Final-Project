import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import Head from 'next/head';
import ForgotPassword from '@/components/OtpInput/forgotPassword';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Halaman Utama</title>
      </Head>
      <ForgotPassword />
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}></div>
      </main>
    </>
  );
}
