import React from 'react';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import Navbar from '@/components/Navbar';
import Header from '@/components/Home/header';
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from '@/components/Profile';
import Cookies from 'js-cookie';

const inter = Inter({ subsets: ['latin'] });

export default function ProfilePage({ userData }) {
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Navbar accessToken={userData.accessToken} username={userData.username} />
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}>
          <Profile username={userData.username} email={userData.email} namaLengkap={userData.namaLengkap} nomorTelepon={userData.nomorTelepon} alamat={userData.alamat} />
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const accessToken = req.cookies.accessToken || null;
  const username = req.cookies.username || null;
  const email = req.cookies.email || null;
  const namaLengkap = req.cookies.namaLengkap || null;
  const nomorTelepon = req.cookies.nomorTelepon || null;
  const alamat = req.cookies.alamat || null;

  const userData = {
    accessToken,
    username,
    email,
    namaLengkap,
    nomorTelepon,
    alamat,
  };

  return {
    props: {
      userData,
    },
  };
}
