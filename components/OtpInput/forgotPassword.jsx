import React, { useState } from 'react';
import styles from '@/styles/OtpInput.module.css';
import { useRouter } from 'next/router';
import axios from 'axios';
import Swal from 'sweetalert2';

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/forgotPassword', {
        email,
      });

      Swal.fire({
        title: response.data.message,
        text: '',
        icon: 'success',
        timer: 3000,
        showConfirmButton: true,
      }).then(() => {
        router.push(`/otp/resetPassword`);
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
      <h1 className={`${styles.title} text-black ${styles.header}`}>Lupa Password</h1>
      <p className={`${styles.subtitle} text-black ${styles.headerDetail}`}>Masukkan email anda</p>
      <form>
        <div className="mb-4">
          <label className={`d-block fw-bold mb-2 text-center ${styles.headerDetail}`} htmlFor="email">
            Email
          </label>
          <input className={`border rounded p-2 text-light fw-bold fs-6 ${styles.headerDetail}`} id="email" type="text" placeholder="Email" onChange={handleEmailChange} />
        </div>
      </form>
      <button className={`${styles.button} ${styles.headerDetail} mt-16`} type="submit" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default ForgotPassword;
