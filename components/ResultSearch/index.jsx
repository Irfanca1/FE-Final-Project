import React, { useEffect, useState } from 'react';
import styles from '@/styles/Home.module.css';
import { useRouter } from 'next/router';
import { Col, Row } from 'react-bootstrap';
import { ImPriceTags } from 'react-icons/im';
import { Card, Button } from 'react-bootstrap';
import { LuMoveHorizontal } from 'react-icons/lu';
import { BiDownArrow, BiUpArrow } from 'react-icons/bi';
import axios from 'axios';
import Swal from 'sweetalert2';

const setLocalStorageDate = (date) => {
  localStorage.setItem('selectedDate', date);
};

const getLocalStorageDate = () => {
  return localStorage.getItem('selectedDate');
};

const HasilPencarian = () => {
  const router = useRouter();
  const { tanggalBerangkat, kotaAwal, kotaTujuan, message } = router.query;
  const [dataTicket, setDataTicket] = useState([]);
  const [hargaTermurah, setHargaTermurah] = useState([]);
  const [hargaTermahal, setHargaTermahal] = useState([]);
  const [selectedDate, setSelectedDate] = useState(tanggalBerangkat || null);
  const [showHargaTermurah, setShowHargaTermurah] = useState(false);
  const [showHargaTermahal, setShowHargaTermahal] = useState(false);

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
        const response = await axios.get(`http://localhost:5000/v1/api/tiket-one-way-fe?tanggalBerangkat=${date}&kotaAwal=${kotaAwal}&kotaTujuan=${kotaTujuan}`);
        const data = response.data;
        data.length !== 0 ? setDataTicket(response.data.data) : 'Tidak ada penerbangan pada tanggal ini!';
        setShowHargaTermurah(false);
        setShowHargaTermahal(false);
      } catch (error) {
        const errorResponse = error.response ? error.response.data.message : error.message;
        console.log('Index : ' + errorResponse);
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

  const [showDetail, setShowDetail] = useState(false);

  const toggleDetail = (ticketId) => {
    setShowDetail((prevState) => (prevState === ticketId ? null : ticketId));
  };

  const handleClickHargaTermurah = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/v1/api/filter-harga-termurah?tanggalBerangkat=${tanggalBerangkat}&kotaAwal=${kotaAwal}&kotaTujuan=${kotaTujuan}`);
      setHargaTermurah(response.data.data);
      setShowHargaTermurah(true);
      setShowHargaTermahal(false);
    } catch (error) {
      setShowHargaTermurah(false);
      setShowHargaTermahal(false);
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

  const handleClickHargaTermahal = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/v1/api/filter-harga-termahal?tanggalBerangkat=${tanggalBerangkat}&kotaAwal=${kotaAwal}&kotaTujuan=${kotaTujuan}`);
      setHargaTermahal(response.data.data);
      setShowHargaTermurah(false);
      setShowHargaTermahal(true);
    } catch (error) {
      setShowHargaTermurah(false);
      setShowHargaTermahal(false);
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

  return (
    <div className="container">
      <div className={`${styles.description}`}>
        {dataTicket.length === 0 ? (
          <Row>
            <Col md={4} className="mb-5">
              <div className="card" style={{ width: '18rem' }}>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Filter</h5>
                </div>
                <Button variant="transparent" className="list-group list-group-flush" onClick={handleClickHargaTermurah}>
                  <li className="list-group-item">
                    <ImPriceTags /> Harga Termurah
                  </li>
                </Button>
                <Button variant="transparent" className="list-group list-group-flush" onClick={handleClickHargaTermahal}>
                  <li className="list-group-item">
                    <ImPriceTags /> Harga Termahal
                  </li>
                </Button>
              </div>
            </Col>
            <Col>
              <div className="fs-2">Mohon Maaf,Tidak ada penerbangan pada tanggal ini!</div>
            </Col>
          </Row>
        ) : (
          <div>
            <Row>
              <Col md={4} sm={12} className="mb-5">
                <div className="card" style={{ width: '18rem' }}>
                  <div className="card-body">
                    <h5 className="card-title fw-bold">Filter</h5>
                  </div>
                  <Button variant="transparent" className="list-group list-group-flush" onClick={() => handleClickHargaTermurah(true)}>
                    <li className="list-group-item">
                      <ImPriceTags /> Harga Termurah
                    </li>
                  </Button>
                  <Button variant="transparent" className="list-group list-group-flush" onClick={() => handleClickHargaTermahal(true)}>
                    <li className="list-group-item">
                      <ImPriceTags /> Harga Termahal
                    </li>
                  </Button>
                </div>
              </Col>
              <Col md={8} sm={12}>
                {(showHargaTermurah ? hargaTermurah : showHargaTermahal ? hargaTermahal : dataTicket).map((data) => (
                  <Card key={data.id} className="mb-3">
                    <Card.Body>
                      <div className="d-flex">
                        <Card.Title className="fw-bold">
                          {data.maskapai.nama_maskapai} - {data.maskapai.tipe_maskapai}
                        </Card.Title>
                        <Button className="ms-auto bg-transparent border border-light" onClick={() => toggleDetail(data.id)}>
                          {showDetail === data.id ? <BiUpArrow className="text-dark" /> : <BiDownArrow className="text-dark" />}
                        </Button>
                      </div>
                      <Card.Text className="fs-6 bg-transparent">
                        <Row>
                          <Col md={8}>
                            <span className={`${styles.spanSelisihJamMenit}`}>
                              {data.selisih_jam}h{data.selisih_menit}m
                            </span>
                            <div className="d-block fw-bold">
                              {data.jam_berangkat}:00 <LuMoveHorizontal className="fs-3 text-danger" style={{ width: '100px' }} /> {data.jam_kedatangan}:00
                            </div>
                            <div>
                              <span style={{ marginRight: '130px' }}>{data.id_bandara_asal}</span> {data.id_bandara_tujuan}
                            </div>
                          </Col>
                          <Col>
                            <span className={`d-block mb-2 fw-bold ${styles.spanHarga}`}>{data.maskapai.harga_tiket}</span>
                            <Button style={{ backgroundColor: 'rgb(147, 6, 147)', borderColor: 'rgb(182, 24, 182)' }} onClick={() => router.push(`/detailsearching/oneWay?ticketBerangkat=${data.id}`)}>
                              Pilih
                            </Button>
                          </Col>
                        </Row>
                      </Card.Text>
                      {showDetail === data.id && (
                        <div className="mt-4">
                          <h5 className={`${styles.spanHarga} fw-bold`}>Detail Penerbangan</h5>
                          <div className="d-flex">
                            <div className="bg-transparent fw-bold border border-light">{data.jam_berangkat}:00</div>
                            <div className={`${styles.spanHarga} bg-transparent fw-bold ms-auto border border-light`}>Keberangkatan</div>
                          </div>
                          <div className={`ms-3`}>{data.tanggal_berangkat}</div>
                          <div className={`ms-3`}>{data.bandaraAwal.nama_bandara}</div> <hr />{' '}
                          <div className={`fw-bold ms-3`}>
                            {data.maskapai.nama_maskapai} - {data.maskapai.tipe_maskapai}
                          </div>
                          <div className={`fw-bold ms-3`}>{data.maskapai.kode_maskapai}</div> <hr />
                          <div className="d-block">
                            <div className={`fw-bold ms-3`}>Informasi : </div>
                            <div className={` ms-3`}>Baggage 20 kg </div>
                            <div className={` ms-3`}>Cabin Baggage 7 kg </div>
                            <div className={` ms-3`}>In Flight Fntertainment </div>
                          </div>{' '}
                          <hr />
                          <div className="d-flex">
                            <div className="bg-transparent fw-bold border border-light">{data.jam_kedatangan}:00</div>
                            <div className={`${styles.spanHarga} bg-transparent fw-bold ms-auto border border-light`}>Kedatangan</div>
                          </div>
                          <div className={`ms-3`}>{data.tanggal_berangkat}</div>
                          <div className={`ms-3`}>{data.bandaraTujuan.nama_bandara}</div> <hr />{' '}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                ))}
              </Col>
            </Row>
          </div>
        )}
      </div>
    </div>
  );
};

export default HasilPencarian;
