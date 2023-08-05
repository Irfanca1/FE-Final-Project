import React from 'react';
import styles from '@/styles/Home.module.css';
import { RiLoginBoxLine } from 'react-icons/ri';

const Navbar = () => {
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
          <button className={`${styles.customButton} ${styles.description} fs-5 rounded p-2`}>
            <RiLoginBoxLine className={`${styles.customButton} me-2 fs-3 `} />
            Masuk
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
