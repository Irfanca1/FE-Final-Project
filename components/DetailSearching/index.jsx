import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import styles from '@/styles/Home.module.css';

const DetailSearching = ({ accessToken }) => {
  const router = useRouter();
  const { ticketBerangkat, ticketPulang } = router.query;
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    nama: '',
    namaKeluarga: '',
    nomorTelepon: '',
    email: '',
  });

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
        console.log('error:' + error.response.data);
      }
    };

    detailPenerbangan();
  }, [ticketBerangkat, ticketPulang]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add your form submission logic here
    console.log('Form data submitted:', formData);
  };

  return (
    <Row>
      <h3 className="text-center fw-bold">{accessToken ? '' : <div className="alert alert-danger">Silakan Login Terlebih Dahulu Untuk Memesan Tiket!</div>}</h3>
      <Col md={7} style={{ width: '30rem' }}>
        <Card>
          <Card.Body>
            <Card.Title className="fw-bold">Isi Data Pemesan</Card.Title>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="name">
                <Form.Label>Nama</Form.Label>
                <Form.Control type="text" name="nama" value={formData.nama} onChange={handleInputChange} placeholder="Masukkan nama anda" />
              </Form.Group>
              <Form.Group controlId="name">
                <Form.Label>Nama Keluarga</Form.Label>
                <Form.Control type="text" name="namaKeluarga" value={formData.namaKeluarga} onChange={handleInputChange} placeholder="Masukkan nama keluarga anda" />
              </Form.Group>
              <Form.Group controlId="name">
                <Form.Label>Nomor Telepon</Form.Label>
                <Form.Control type="text" name="nomorTelepon" value={formData.nomorTelepon} onChange={handleInputChange} placeholder="Masukkan nomor telepom amda" />
              </Form.Group>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Masukkan email anda" />
              </Form.Group>
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
            <h5 className={`${styles.spanHarga} fw-bold`}>Detail Penerbangan Berangkat</h5>
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
