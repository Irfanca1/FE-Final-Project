import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { AiOutlineArrowLeft, AiOutlineMinus } from 'react-icons/ai';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import styles from '@/styles/Home.module.css';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import axios from 'axios';
import { format } from 'date-fns';

const setLocalStorageDate = (date) => {
  localStorage.setItem('selectedDate', date);
};

const getLocalStorageDate = () => {
  return localStorage.getItem('selectedDate');
};

const NavHasilPencarian = () => {
  const router = useRouter();
  const { tanggalBerangkat, kotaAwal, kotaTujuan } = router.query;
  const [dataTicket, setDataTicket] = useState([]);
  const [selectedDate, setSelectedDate] = useState(tanggalBerangkat || null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedDate = getLocalStorageDate();
    setSelectedDate(storedDate || tanggalBerangkat || null);
  }, [tanggalBerangkat]);

  useEffect(() => {
    if (selectedDate) {
      setLocalStorageDate(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    const getResultSearching = async () => {
      try {
        const date = localStorage.getItem('selectedDate');
        const response = await axios.get(`http://localhost:5000/v1/api/get-date-one-trip?tanggalBerangkat=${date}`);
        setDataTicket(response.data.data);
      } catch (error) {
        const errorResponse = error.response ? error.response.data.message : error.message;
        if (errorResponse) {
          Swal.fire({
            title: errorResponse,
            text: '',
            icon: 'error',
            showConfirmButton: true,
            timer: 3000,
          });
        }
      }
    };

    getResultSearching();
  }, [tanggalBerangkat, kotaAwal, kotaTujuan]);

  const handleUbahPencarianClick = () => {
    setIsLoading(true);
    router.push('/');
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleDateSelect = (selectedDate) => {
    setSelectedDate(selectedDate);
    router.push({
      pathname: '/hasilPencarian',
      query: { tanggalBerangkat: selectedDate, kotaAwal, kotaTujuan },
    });
  };

  return (
    <nav className={`navbar bg-light shadow-sm p-5`}>
      <div className={`fw-bold bg-light fs-3 ms-3 ${styles.description} `}>Pilih Penerbangan</div>
      <div className={`container-fluid ${styles.description} `}>
        <div className="d-flex">
          <div className={`${styles.box1} p-2 text-light fs-6 align-item-center justify-content-center rounded fw-bold`}>
            {kotaAwal} <MdOutlineKeyboardArrowRight /> {kotaTujuan}
          </div>
          <Button variant="success" className={`${styles.box2} p-2 text-light fs-6 ms-3 rounded fw-bold`} onClick={handleUbahPencarianClick}>
            {isLoading ? 'Loading...' : 'Ubah Pencarian'}
          </Button>
        </div>
        {dataTicket.map((data) => (
          <Button
            className={`mt-3 ${selectedDate === format(new Date(data.tanggal_berangkat), 'dd-MM-yyyy') ? styles.customButton : styles.selected}`}
            key={data.id}
            onClick={() => handleDateSelect(format(new Date(data.tanggal_berangkat), 'dd-MM-yyyy'))}
          >
            <div className="d-block">
              <span className="fw-bold">{data.hari}</span>
              <div className="fw-bold">{format(new Date(data.tanggal_berangkat), 'dd-MM-yyyy')}</div>
            </div>
          </Button>
        ))}
      </div>
    </nav>
  );
};

export default NavHasilPencarian;
