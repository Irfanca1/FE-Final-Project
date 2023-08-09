import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/OtpInput.module.css';
import { useRouter } from 'next/router';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';

const OtpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const router = useRouter();
  const { email } = router.query;

  const maskedEmail = `${email.slice(0, 1)}**********${email.slice(email.indexOf('@') - 3)}`;

  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  useEffect(() => {
    let intervalId;

    if (isTimerRunning) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isTimerRunning]);

  useEffect(() => {
    if (timer === 0) {
      setIsTimerRunning(false);
    }
  }, [timer]);

  const handleResendOtp = async (e) => {
    e.preventDefault();
    setTimer(60);
    setIsTimerRunning(true);

    try {
      const response = await axios.post('/api/resendOtp', {
        email,
      });

      Swal.fire(`${response.data.message}`, 'Silakan cek email anda!', 'success');
    } catch (error) {
      if (error.response && error.response.data) {
        Swal.fire(`${response.data.message}`, '', 'error');
      }
      Swal.fire(`${error.response.data.message}`, 'Periksa kembali', 'error');
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value;

    setOtp((prevOtp) => {
      const newOtp = [...prevOtp];
      newOtp[index] = value;
      return newOtp;
    });

    if (value !== '' && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/verifyOtp', {
        email,
        otp: otp.join(''),
      });

      Swal.fire({
        title: response.data.message,
        text: '',
        icon: 'success',
        timer: 3000,
        showConfirmButton: true,
      }).then(() => {
        router.push('/auth/login');
      });
    } catch (error) {
      if (error.response && error.response.data) {
        Swal.fire({
          title: error.response.data.message,
          text: 'Periksa kembali',
          icon: 'error',
          timer: 3000,
          showConfirmButton: true,
        });
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={`${styles.title} text-dark ${styles.header}`}>Verifikasi OTP</h1>
      <p className={`${styles.subtitle} text-dark ${styles.headerDetail}`}>Masukkan OTP yang dikirimkan ke {maskedEmail}</p>
      <div className={`${styles.otpContainer}`}>
        {otp.map((digit, index) => (
          <input
            key={index}
            className={`${styles.otpInput} text-light fw-bold`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(input) => (inputRefs.current[index] = input)}
            autoFocus={index === 0}
            required
          />
        ))}
      </div>
      {isTimerRunning ? (
        <p className={`${styles.timer} text-dark ${styles.headerDetail}`}>Waktu tersisa: {timer} detik</p>
      ) : (
        <Button className={`${styles.resendButton} ${styles.headerDetail} mt-5 mb-5 bg-transparent text-dark fw-bold border border-light`} onClick={handleResendOtp}>
          Kirim ulang OTP
        </Button>
      )}
      <button className={`${styles.button} ${styles.headerDetail}`} type="submit" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default OtpVerification;
