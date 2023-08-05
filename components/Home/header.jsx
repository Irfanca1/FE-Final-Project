import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '@/styles/Home.module.css';

const Header = () => {
  return (
    <div>
      <div className={`${styles.background} mt-5 text-center`}>a</div>
      <div className="container">
        <div className={`card-header p-5 rounded ${styles.description} ${styles.header}`}>
          <div className="row">
            <div className={`col-6 fs-1 fw-bold`}>
              Diskon Hari ini <span className={`d-block ${styles.span}`}>85%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
