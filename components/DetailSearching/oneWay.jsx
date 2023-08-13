import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import styles from '@/styles/Home.module.css';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

const DetailSearchingOneWay = ({ accessToken }) => {
  const router = useRouter();
  const { ticketBerangkat } = router.query;
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    id_penerbangan: ticketBerangkat,
    nama_lengkap: '',
    nama_keluarga: '',
    nomor_telepon: '',
    email: '',
    jumlah_penumpang: '',
  });
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const totalSeats = 72;

  useEffect(() => {
    const getKursi = async () => {
      try {
        const response = await axios.get('/api/getKursi');
        const kursiData = response.data.data;
        const occupiedSeatCodes = kursiData.map((seat) => seat.kursi);

        const allOccupiedSeats = occupiedSeatCodes.join(',');

        const individualSeats = allOccupiedSeats.split(',');

        setOccupiedSeats(individualSeats);
      } catch (error) {
        console.log(error.message);
      }
    };

    getKursi();
  }, []);

  const isSeatOccupied = (seatCode) => {
    return occupiedSeats.includes(seatCode);
  };

  const renderSeats = () => {
    const seats = [];

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let alphabetIndex = 0;

    for (let seatNumber = 1; seatNumber <= totalSeats; seatNumber++) {
      const row = alphabet[alphabetIndex];
      const seatCode = `${row}${Math.ceil(seatNumber / alphabet.length)}`;
      const isOccupied = isSeatOccupied(seatCode);
      const seatColor = isOccupied ? styles.occupiedSeat : styles.availableSeat;

      if (isOccupied) {
        seats.push(
          <div key={seatNumber} className={`${styles.seat} ${seatColor}`}>
            {seatCode}
          </div>
        );
      } else {
        seats.push(
          <div key={seatNumber} className={`${styles.seat} ${seatColor} ${styles.clickable}`} onClick={() => handleSeatClick(seatCode)}>
            {seatCode}
          </div>
        );
      }

      if (alphabetIndex < alphabet.length - 1) {
        alphabetIndex++;
      } else {
        alphabetIndex = 0;
      }
    }

    return seats;
  };

  const handleSeatClick = (seatCode) => {
    if (isSeatOccupied(seatCode)) {
      const updatedOccupiedSeats = occupiedSeats.filter((seat) => seat !== seatCode);
      const updatedSelectedSeats = selectedSeats.filter((seat) => seat !== seatCode);
      setOccupiedSeats(updatedOccupiedSeats);
      setSelectedSeats(updatedSelectedSeats);
    } else {
      const updatedOccupiedSeats = [...occupiedSeats, seatCode];
      const updatedSelectedSeats = [...selectedSeats, seatCode];
      setOccupiedSeats(updatedOccupiedSeats);
      setSelectedSeats(updatedSelectedSeats);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const detailPenerbanganOneWay = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/v1/api/select-ticket/${ticketBerangkat}`);
        setData(response.data.data);
      } catch (error) {
        Swal.fire({
          title: error.response.message,
          text: '',
          icon: 'error',
          timer: 3000,
          showConfirmButton: true,
        });
      }
    };

    detailPenerbanganOneWay();
  }, [ticketBerangkat]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const accessToken = Cookies.get('accessToken');

      if (!accessToken) {
        Swal.fire({
          title: 'Silakan login terlebih dahulu',
          text: '',
          icon: 'error',
          timer: 3000,
          showConfirmButton: true,
        });
        return;
      }

      const updatedFormData = {
        id_penerbangan: parseInt(ticketBerangkat),
        nama_lengkap: formData.nama_lengkap,
        nama_keluarga: formData.nama_keluarga,
        nomor_telepon: formData.nomor_telepon,
        email: formData.email,
        jumlah_penumpang: parseInt(formData.jumlah_penumpang),
        kursi: selectedSeats.join(','),
      };

      const response = await axios.post('/api/order', updatedFormData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      Swal.fire({
        title: response.data.message,
        text: 'Silakan lakukan pembayaran!',
        timer: 3000,
        showConfirmButton: true,
        icon: 'success',
      }).then(() => {
        router.push(`/payment?order=${response.data.data.id}`);
      });
    } catch (error) {
      console.log('error : ', error.response);
      console.log(error.message);
    }
  };

  return (
    <Row>
      <h3 className="text-center fw-bold">{accessToken ? '' : <div className="alert alert-danger">Silakan Login Terlebih Dahulu Untuk Memesan Tiket!</div>}</h3>
      <Col md={7} style={{ width: '40rem' }}>
        <Card className="mb-3">
          <Card.Body>
            <Card.Title className="fw-bold">Isi Data Pemesan</Card.Title>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="nama_lengkap">
                <Form.Label>Nama Lengkap</Form.Label>
                <Form.Control type="text" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleInputChange} placeholder="Masukkan nama anda" />
              </Form.Group>
              <Form.Group controlId="name">
                <Form.Label>Nama Keluarga</Form.Label>
                <Form.Control type="text" name="nama_keluarga" value={formData.nama_keluarga} onChange={handleInputChange} placeholder="Masukkan nama keluarga anda" />
              </Form.Group>
              <Form.Group controlId="name">
                <Form.Label>Nomor Telepon</Form.Label>
                <Form.Control type="text" name="nomor_telepon" value={formData.nomor_telepon} onChange={handleInputChange} placeholder="Masukkan nomor telepom amda" />
              </Form.Group>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Masukkan email anda" />
              </Form.Group>
              <Form.Group controlId="jumlah_penumpang">
                <Form.Label>Jumlah Penumpang</Form.Label>
                <Form.Control type="text" name="jumlah_penumpang" value={formData.jumlah_penumpang} onChange={handleInputChange} placeholder="Masukkan email anda" />
              </Form.Group>
              <Card className="mt-3 mb-3">
                <div className="mt-4 p-2">
                  <h5 className={`${styles.spanHarga} fw-bold`}>Pilihan Kursi</h5>
                  <div className={styles.seatContainer}>{renderSeats()}</div>
                </div>
              </Card>
              <Button type="submit" variant="primary">
                Submit
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4} style={{ width: '25rem' }}>
        <Card className="mb-3">
          <div className="mt-4 p-2">
            <h5 className={`${styles.spanHarga} fw-bold`}>Detail Penerbangan</h5>
            <div>
              <div className="d-flex">
                <p className="bg-transparent fw-bold border border-light">{data.jam_berangkat}:00</p>
                <p className={`${styles.spanHarga} bg-transparent fw-bold ms-auto border border-light`}>Keberangkatan</p>
              </div>
              <div className={`ms-3`}>{data.tanggal_berangkat}</div>
              {data.bandaraAwal && (
                <div>
                  <div className={`ms-3`}>{data.bandaraAwal.nama_bandara}</div> <hr />
                </div>
              )}
              {data.maskapai && (
                <div>
                  <div className={`fw-bold ms-5`}>
                    {data.maskapai.nama_maskapai} - {data.maskapai.tipe_maskapai}
                  </div>
                  <div className={`fw-bold ms-5`}>{data.maskapai.kode_maskapai}</div>
                </div>
              )}
              <div className="d-block ms-5">
                <div className={`fw-bold`}>Informasi : </div>
                <div>Baggage 20 kg </div>
                <div>Cabin Baggage 7 kg </div>
                <div>In Flight Fntertainment </div>
              </div>{' '}
              <hr />
              <div className="d-flex">
                <p className="bg-transparent fw-bold border border-light">{data.jam_kedatangan}:00</p>
                <p className={`${styles.spanHarga} bg-transparent fw-bold ms-auto border border-light`}>Kedatangan</p>
              </div>
              <div className={`ms-3`}>{data.tanggal_kedatangan}</div>
              {data.bandaraTujuan && (
                <div>
                  <div className={`ms-3`}>{data.bandaraTujuan.nama_bandara}</div> <hr />
                </div>
              )}
              <div>
                <div className="fw-bold">Rincian harga</div>
                <div className="d-flex">
                  <p className="bg-transparent border border-light">Harga Tiket</p>
                  {data.maskapai && (
                    <div>
                      <p className={`bg-transparent fw-bold ms-auto border border-light`}>{data.maskapai.harga_tiket}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default DetailSearchingOneWay;
