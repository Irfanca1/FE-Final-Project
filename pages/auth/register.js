import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import Head from 'next/head';
import Register from '@/components/Auth/register';
import 'bootstrap/dist/css/bootstrap.min.css';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Register</title>
      </Head>

      <Register />
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}></div>
      </main>
    </>
  );
}
