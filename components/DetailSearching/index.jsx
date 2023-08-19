import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import styles from '@/styles/Home.module.css';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

const DetailSearching = ({ accessToken }) => {
  const router = useRouter();
  const { ticketBerangkat, ticketPulang } = router.query;
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    id_penerbangan_berangkat: ticketBerangkat,
    id_penerbangan_pulang: ticketPulang,
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
    const detailPenerbangan = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/v1/api/select-ticket-round-trip/${ticketBerangkat}/${ticketPulang}`);
        setData(response.data.data);
      } catch (error) {
        console.log('error:' + error.response);
      }
    };

    detailPenerbangan();
  }, [ticketBerangkat, ticketPulang]);

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
        id_penerbangan_berangkat: parseInt(ticketBerangkat),
        id_penerbangan_pulang: parseInt(ticketPulang),
        nama_lengkap: formData.nama_lengkap,
        nama_keluarga: formData.nama_keluarga,
        nomor_telepon: formData.nomor_telepon,
        email: formData.email,
        jumlah_penumpang: parseInt(formData.jumlah_penumpang),
        kursi: selectedSeats.join(','),
      };

      const response = await axios.post('/api/orderRoundTrip', updatedFormData, {
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
        router.push(`/payment/roundtrip?order=${response.data.data.id}`);
      });
    } catch (error) {
      console.log(error.response);
      Swal.fire({
        title: error.response,
        text: '',
        timer: 3000,
        showConfirmButton: true,
        icon: 'error',
      });
    }
  };

  return (
    <Row>
      <h3 className="text-center fw-bold">{accessToken ? '' : <div className="alert alert-danger">Silakan Login Terlebih Dahulu Untuk Memesan Tiket!</div>}</h3>
      <Col md={7} style={{ width: '30rem' }}>
        <Card className="mb-3">
          <Card.Body>
            <Card.Title className="fw-bold">Isi Data Pemesan</Card.Title>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="nama_lengkap">
                <Form.Label>Nama Lengkap</Form.Label>
                <Form.Control type="text" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleInputChange} placeholder="Masukkan nama anda" />
              </Form.Group>
              <Form.Group controlId="nama_keluarga">
                <Form.Label>Nama Keluarga</Form.Label>
                <Form.Control type="text" name="nama_keluarga" value={formData.nama_keluarga} onChange={handleInputChange} placeholder="Masukkan nama keluarga anda" />
              </Form.Group>
              <Form.Group controlId="nomor_telepon">
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
      <Col md={5}>
        <Card className="mb-3">
          <div className="mt-4 p-2">
            <h5 className={`${styles.spanHarga} fw-bold`}>Detail Penerbangan Berangkat</h5>
            {data.departure && (
              <div>
                <div className="d-flex">
                  <p className="bg-transparent fw-bold border border-light">{data.departure.jam_berangkat}</p>
                  <p className={`${styles.spanHarga} bg-transparent fw-bold ms-auto border border-light`}>Keberangkatan</p>
                </div>
                <div className={`ms-3`}>{data.departure.tanggal_berangkat}</div>
                <div className={`ms-3`}>{data.departure.bandaraAwal.nama_bandara}</div> <hr />{' '}
                <div className={`fw-bold ms-5`}>
                  {data.departure.maskapai.nama_maskapai} - {data.departure.maskapai.tipe_maskapai}
                </div>
                <div className={`fw-bold ms-5`}>{data.departure.maskapai.kode_maskapai}</div>
                <div className="d-block ms-5">
                  <div className={`fw-bold`}>Informasi : </div>
                  <div>Baggage 20 kg </div>
                  <div>Cabin Baggage 7 kg </div>
                  <div>In Flight Fntertainment </div>
                </div>{' '}
                <hr />
                <div className="d-flex">
                  <p className="bg-transparent fw-bold border border-light">{data.departure.jam_kedatangan}</p>
                  <p className={`${styles.spanHarga} bg-transparent fw-bold ms-auto border border-light`}>Kedatangan</p>
                </div>
                <div className={`ms-3`}>{data.departure.tanggal_kedatangan}</div>
                <div className={`ms-3`}>{data.departure.bandaraTujuan.nama_bandara}</div> <hr />{' '}
                <div>
                  <div className="fw-bold">Rincian harga</div>
                  <div className="d-flex">
                    <p className="bg-transparent border border-light">Harga Tiket</p>
                    <p className={`bg-transparent fw-bold ms-auto border border-light`}>{data.departure.maskapai.harga_tiket}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
        <Card className="mb-3">
          <div className="mt-4 p-2">
            <h5 className={`${styles.spanHarga} fw-bold`}>Detail Penerbangan Pulang</h5>
            {data.return && (
              <div>
                <div className="d-flex">
                  <p className="bg-transparent fw-bold border border-light">{data.return.jam_berangkat}</p>
                  <p className={`${styles.spanHarga} bg-transparent fw-bold ms-auto border border-light`}>Keberangkatan</p>
                </div>
                <div className={`ms-3`}>{data.return.tanggal_berangkat}</div>
                <div className={`ms-3`}>{data.return.bandaraAwal.nama_bandara}</div> <hr />{' '}
                <div className={`fw-bold ms-5`}>
                  {data.return.maskapai.nama_maskapai} - {data.return.maskapai.tipe_maskapai}
                </div>
                <div className={`fw-bold ms-5`}>{data.return.maskapai.kode_maskapai}</div>
                <div className="d-block ms-5">
                  <div className={`fw-bold`}>Informasi : </div>
                  <div>Baggage 20 kg </div>
                  <div>Cabin Baggage 7 kg </div>
                  <div>In Flight Fntertainment </div>
                </div>{' '}
                <hr />
                <div className="d-flex">
                  <p className="bg-transparent fw-bold border border-light">{data.return.jam_kedatangan}</p>
                  <p className={`${styles.spanHarga} bg-transparent fw-bold ms-auto border border-light`}>Kedatangan</p>
                </div>
                <div className={`ms-3`}>{data.return.tanggal_kedatangan}</div>
                <div className={`ms-3`}>{data.return.bandaraTujuan.nama_bandara}</div> <hr />{' '}
                <div>
                  <div className="fw-bold">Rincian harga</div>
                  <div className="d-flex">
                    <p className="bg-transparent border border-light">Harga Tiket</p>
                    <p className={`bg-transparent fw-bold ms-auto border border-light`}>{data.return.maskapai.harga_tiket}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default DetailSearching;
