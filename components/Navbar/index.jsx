import React from 'react';
import styles from '@/styles/Home.module.css';
import { RiLoginBoxLine, RiLogoutBoxLine } from 'react-icons/ri';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const Navbar = () => {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('accessToken');
    localStorage.removeItem('token');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('token');
    router.push('/auth/login');
  };

  const handleToLogin = () => {
    router.push('/auth/login');
  };

  const accessToken = Cookies.get('accessToken');

  return (
    <nav className="navbar bg-light shadow-sm">
      <div className="container-fluid container">
        <div className="d-flex align-items-center">
          <img src="/logo@2x.png" alt="Logo" width={'150px'} />
          <form className={`d-flex flex-grow-1 ms-3 ${styles.description}`} role="search">
            <input className={`form-control me-2 fw-bold`} type="search" placeholder="Search" aria-label="Search" />
            <button className={`${styles.customButton} rounded p-2 fw-bold`} type="submit">
              Search
            </button>
          </form>
        </div>
        <div className="navbar-brand">
          {accessToken ? (
            <button className={`${styles.customButton} ${styles.description} fs-5 rounded p-2`} onClick={handleLogout}>
              <RiLogoutBoxLine className={`${styles.customButton} me-2 fs-3 `} />
              Logout
            </button>
          ) : (
            <button className={`${styles.customButton} ${styles.description} fs-5 rounded p-2`} onClick={handleToLogin}>
              <RiLoginBoxLine className={`${styles.customButton} me-2 fs-3 `} />
              Masuk
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
