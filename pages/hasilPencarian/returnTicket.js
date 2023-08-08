import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavHasilPencarianRoundTrip from '@/components/ResultSearch/navRoundTrip';
import HasilPencarianRoundTripReturn from '@/components/ResultSearch/returnTicket';
import NavHasilPencarianRoundTripReturn from '@/components/ResultSearch/navReturnTicket';

const inter = Inter({ subsets: ['latin'] });

export default function SelectTicketReturn() {
  return (
    <>
      <Head>
        <title>Hasil Pencarian</title>
      </Head>
      <NavHasilPencarianRoundTripReturn />
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}>
          <HasilPencarianRoundTripReturn />
        </div>
      </main>
    </>
  );
}
