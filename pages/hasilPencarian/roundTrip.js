import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';
import HasilPencarianRoundTrip from '@/components/ResultSearch/departureTicket';
import NavHasilPencarianRoundTrip from '@/components/ResultSearch/navRoundTrip';

const inter = Inter({ subsets: ['latin'] });

export default function SelectTicket() {
  return (
    <>
      <Head>
        <title>Hasil Pencarian</title>
      </Head>
      <NavHasilPencarianRoundTrip />
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}>
          <HasilPencarianRoundTrip />
        </div>
      </main>
    </>
  );
}
