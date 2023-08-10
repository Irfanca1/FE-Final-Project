import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import styles from '@/styles/Home.module.css';

const DetailSearchingOneWay = ({ accessToken }) => {
  const router = useRouter();
  const { ticketBerangkat } = router.query;
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
    const detailPenerbanganOneWay = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/v1/api/select-ticket/${ticketBerangkat}`);
        setData(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.log('error: ' + error.response.data);
      }
    };

    detailPenerbanganOneWay();
  }, [ticketBerangkat]);

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
