import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import HalamanUtama from '@/components/Home';
import Navbar from '@/components/Navbar';
import Header from '@/components/Home/header';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Halaman Utama</title>
      </Head>
      <Navbar />
      <Header />
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}>
          <HalamanUtama />
        </div>
      </main>
    </>
  );
}
