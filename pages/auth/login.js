import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from '@/components/Auth/login';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>

      <Login />
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}></div>
      </main>
    </>
  );
}
