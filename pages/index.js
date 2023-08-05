import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import HalamanUtama from '@/components/Home';
import Navbar from '@/components/Navbar';
import Header from '@/components/Home/header';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <>
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
