import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import Head from 'next/head';
import ResetPassword from '@/components/OtpInput/resetPassword';
import 'bootstrap/dist/css/bootstrap.min.css';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Halaman Utama</title>
      </Head>
      <ResetPassword />
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}></div>
      </main>
    </>
  );
}
