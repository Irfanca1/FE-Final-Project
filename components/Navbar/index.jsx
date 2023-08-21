import React, { useEffect, useState } from 'react';
import styles from '@/styles/Home.module.css';
import { RiLoginBoxLine, RiLogoutBoxLine, RiUserLine, RiHistoryLine } from 'react-icons/ri';
import { IoMdNotificationsOutline } from 'react-icons/io';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Modal from 'react-modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Swal from 'sweetalert2';

const capitalizeFirstLetter = (string) => {
  if (string === null || string === undefined) {
    return '';
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const Navbar = ({ accessToken, username }) => {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);

  const formattedUsername = capitalizeFirstLetter(username);

  useEffect(() => {
    if (accessToken) {
      import('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, [accessToken]);

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

  const handleToProfile = () => {
    router.push('/profile/');
  };

  const handleToHistory = () => {
    router.push('/historyorder/');
  };

  const notificationClick = async () => {
    try {
      if (accessToken) {
        const response = await axios.get('/api/notification', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setNotifications(response.data.data);
      } else {
        const response = await axios.get('/api/notification');
        setNotifications(response.data.data);
      }
    } catch (error) {
      Swal.fire({
        title: error.response.data.message,
        text: 'Internal server error',
        icon: 'error',
        showConfirmButton: true,
        timer: 2000,
      });
    }
  };

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
            <div className="d-flex">
              <div className="" id="notifDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <IoMdNotificationsOutline className={`fs-3 me-4 mt-2 ${styles.notification}`} onClick={notificationClick} />
              </div>
              {/* NOTIFICATION DROPDOWN */}
              <div className="dropdown" style={{ position: 'relative', left: '-30rem' }}>
                <ul className="dropdown-menu" aria-labelledby="notifDropdown" style={{ width: '30rem', maxWidth: '30rem', whiteSpace: 'pre-wrap', maxHeight: '15rem', overflowY: 'auto' }}>
                  {notifications.map((notif, index) => (
                    <li
                      className={`p-2`}
                      style={{
                        background: index % 2 === 0 ? '#f0f0f0' : '#fff',
                      }}
                      key={notif.id}
                    >
                      <div className="flex">
                        <div className={`${styles.description} d-flex align-items-center`}>
                          <IoMdNotificationsOutline className={`fs-5 me-1 ${styles.notification}`} />
                          {notif.judul}
                          <div className="ms-auto flex justify-content-between">
                            {notif.tanggal}, {notif.jam}
                          </div>
                        </div>
                      </div>
                      <div className={`${styles.headerDetail} fw-bold `}>{notif.pesan}</div>
                      <div className={`${styles.description}`}>{notif.pesanTambahan}</div>
                    </li>
                  ))}
                </ul>
              </div>
              {/* PROFILE DROPDOWN */}
              <div className="dropdown">
                <button className={`${styles.customButton} ${styles.description} fs-5 rounded p-2 dropdown-toggle me-3`} type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  {formattedUsername}
                </button>
                <ul className="dropdown-menu" aria-labelledby="userDropdown">
                  <li>
                    <button className={`rounded dropdown-item p-2 bg-transparent text-dark border border-light`} onClick={handleToProfile}>
                      <RiUserLine className={`me-2 `} />
                      Profile
                    </button>
                  </li>
                  <li>
                    <button className={`rounded dropdown-item p-2 bg-transparent text-dark border border-light`} onClick={handleToHistory}>
                      <RiHistoryLine className={`me-2 `} />
                      History Pemesanan
                    </button>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className={`rounded dropdown-item p-2 bg-transparent text-dark border border-light`} onClick={handleLogout}>
                      <RiLogoutBoxLine className={`me-2 `} />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="d-flex">
              <div className="" id="notifDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <IoMdNotificationsOutline className={`fs-3 me-4 mt-2 ${styles.notification}`} onClick={notificationClick} />
              </div>
              {/* NOTIFICATION DROPDOWN */}
              <div className="dropdown" style={{ position: 'relative', left: '-30rem' }}>
                <ul className="dropdown-menu" aria-labelledby="notifDropdown" style={{ width: '30rem', maxWidth: '30rem', whiteSpace: 'pre-wrap' }}>
                  {notifications.map((notif) => (
                    <li className="p-2">
                      <div className="flex">
                        <div className={`${styles.description} d-flex align-items-center`}>
                          <IoMdNotificationsOutline className={`fs-5 me-1 ${styles.notification}`} />
                          {notif.judul}
                          <div className="ms-auto flex justify-content-between">
                            {notif.tanggal}, {notif.jam}
                          </div>
                        </div>
                      </div>
                      <div className={`${styles.headerDetail} fw-bold `}>{notif.pesan}</div>
                      <div className={`${styles.description}`}>{notif.pesanTambahan}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <button className={`${styles.customButton} ${styles.description} fs-5 rounded p-2`} onClick={handleToLogin}>
                <RiLoginBoxLine className={`${styles.customButton} me-2 fs-3 `} />
                Masuk
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
