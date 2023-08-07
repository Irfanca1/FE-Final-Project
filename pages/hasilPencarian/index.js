import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import NavHasilPencarian from '@/components/ResultSearch/nav';
import HasilPencarian from '@/components/ResultSearch';
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';

const inter = Inter({ subsets: ['latin'] });

export default function SelectTicket() {
  return (
    <>
      <Head>
        <title>Hasil Pencarian</title>
      </Head>
      <NavHasilPencarian />
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}>
          <HasilPencarian />
        </div>
      </main>
    </>
  );
}
