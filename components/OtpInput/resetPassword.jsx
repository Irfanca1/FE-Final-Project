import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/OtpInput.module.css';
import { useRouter } from 'next/router';
import axios from 'axios';
import Swal from 'sweetalert2';

const ResetPassword = () => {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/resetPassword', {
        otp,
        newPassword,
      });

      Swal.fire({
        title: response.data.message,
        text: '',
        icon: 'success',
        timer: 3000,
        showConfirmButton: true,
      }).then(() => {
        router.push(`/auth/login`);
      });
    } catch (error) {
      if (error.response.data) {
        Swal.fire({
          title: error.response.data.error,
          text: 'Periksa kembali!',
          icon: 'error',
          timer: 3000,
          showConfirmButton: true,
        });
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={`${styles.title} text-dark ${styles.header}`}>Lupa Password</h1>
      <p className={`${styles.subtitle} text-dark ${styles.headerDetail}`}>Masukkan email anda</p>
      <form>
        <div className="mb-4">
          <label className={`d-block fw-bold mb-2 ${styles.headerDetail}`} htmlFor="email">
            Otp
          </label>
          <input className={`border rounded p-2 text-light fw-bold ${styles.headerDetail}`} id="otp" type="text" placeholder="Masukkan OTP" onChange={handleOtpChange} />
        </div>
        <div className="mb-4">
          <label className={`d-block fw-bold mb-2 ${styles.headerDetail}`} htmlFor="email">
            Password
          </label>
          <input className={`border rounded p-2 text-light fw-bold ${styles.headerDetail}`} id="password" type="password" placeholder="*****************" onChange={handleNewPasswordChange} />
        </div>
      </form>
      <button className={`${styles.button} ${styles.headerDetail} mt-16`} type="submit" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default ResetPassword;
