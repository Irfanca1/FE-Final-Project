import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import styles from '@/styles/Home.module.css';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { FaLocationDot } from 'react-icons/fa';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { LuMoveHorizontal } from 'react-icons/lu';

const HistoryOrderRoundTrip = ({ accessToken }) => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [dataId, setDataId] = useState(null);
  const [order, setOrder] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const handleCardClick = (orderId) => {
    setSelectedOrderId(orderId);
  };

  useEffect(() => {
    const getHistoryOrder = async () => {
      if (!accessToken) {
        Swal.fire({
          title: 'Anda belum login',
          text: 'Silakan login terlebih dahulu',
          timer: 3000,
          icon: 'error',
          showConfirmButton: true,
        }).then(() => {
          router.push('/');
        });
      }

      try {
        const response = await axios.get('/api/historyorder', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setData(response.data.data);
        setDataId(response.data.data[0].order.id);
        console.log(response.data.data);
      } catch (error) {
        Swal.fire({
          title: error.response.data.message,
          text: '',
          timer: 3000,
          icon: 'error',
          showConfirmButton: true,
        }).then(() => {
          router.push('/');
        });
      }
    };
    getHistoryOrder();
  }, []);

  useEffect(() => {
    const detailOrder = async () => {
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

      try {
        const response = await axios.get(`http://localhost:5000/v1/api/get-order-round-trip/${selectedOrderId ? selectedOrderId : dataId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setOrder(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.log(error.response);
      }
    };
    detailOrder();
  }, [selectedOrderId, dataId]);

  return (
    <div>
      {accessToken ? (
        <div>
          <div>
            <div className="fw-bold fs-5">Riwayat Pemesanan</div>
            <div className={`${styles.background} p-4 text-light fs-5 mb-3`} style={{ width: '65rem', height: '5rem' }}>
              <AiOutlineArrowLeft /> Beranda
            </div>
          </div>
          <div>
            <Row>
              <Col md={7}>
                {data.map((data) => (
                  <Card key={data.id} className="mb-3" style={{ cursor: 'pointer' }} onClick={() => handleCardClick(data.order ? data.order.id : dataId)}>
                    <Card.Body style={{ cursor: 'pointer' }} onClick={() => handleCardClick(data.order ? data.order.id : dataId)}>
                      <div>
                        {data.order.status_pembayaran === 'paid' ? (
                          <div className="bg-success text-light rounded fw-bold fs-5 text-center p-2" style={{ width: '100px' }}>
                            {data.order.status_pembayaran}
                          </div>
                        ) : (
                          <div className="bg-danger text-light rounded fw-bold fs-5 text-center p-2" style={{ width: '100px' }}>
                            {data.order.status_pembayaran}
                          </div>
                        )}
                      </div>
                      <div className="d-flex">
                        <Card.Title className="fw-bold"></Card.Title>
                      </div>
                      <Card.Text className="fs-6 bg-transparent">
                        <Row>
                          <Col md={8} style={{ width: '40rem' }}>
                            <span className={`${styles.spanSelisihJamMenit}`} style={{ marginLeft: '195px' }}>
                              {data.tiketBerangkat.selisih_jam}h{data.tiketBerangkat.selisih_menit}m
                            </span>
                            <div className="d-flex ">
                              <div className="d-block">
                                <p className="bg-transparent border border-light fw-bold">{data.tiketBerangkat.bandaraAwal.kota}</p>
                                <p className="bg-transparent border border-light">{data.tiketBerangkat.tanggal_berangkat}</p>
                                <p className="bg-transparent border border-light">{data.tiketBerangkat.jam_berangkat}</p>
                              </div>{' '}
                              <LuMoveHorizontal className="fs-3 text-danger" style={{ width: '130px' }} />{' '}
                              <div className="d-block">
                                <p className="bg-transparent border border-light fw-bold">{data.tiketBerangkat.bandaraTujuan.kota}</p>
                                <p className="bg-transparent border border-light">{data.tiketBerangkat.tanggal_kedatangan}</p>
                                <p className="bg-transparent border border-light">{data.tiketBerangkat.jam_kedatangan}</p>
                              </div>{' '}
                            </div>{' '}
                            <hr />
                            <div className="d-flex">
                              <Row>
                                <Col md={4} style={{ width: '10rem' }}>
                                  <div className="fw-bold">Booking Code</div>
                                  <div>{data.order.kode_booking}</div>
                                </Col>
                                <Col md={4} style={{ width: '10rem' }}>
                                  <div className="fw-bold">Class</div>
                                  <div>{data.penerbanganBerangkat.maskapai.tipe_maskapai}</div>
                                </Col>
                                <Col md={4} style={{ width: '10rem' }}>
                                  <div className="fw-bold "></div>
                                  <div className={`fw-bold mt-4 ${styles.span}`}>{data.totalHargaTiketBerangkat}</div>
                                </Col>
                              </Row>
                            </div>
                            <div>
                              <span style={{ marginRight: '130px' }}>{}</span> {}
                            </div>
                          </Col>
                        </Row>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                ))}
              </Col>
              <Col md={5}>
                <Card>
                  <div className="mt-4 p-2">
                    <h5 className={`${styles.spanHarga} fw-bold`}>Detail Pesanan</h5>
                    {order.order && (
                      <h5 className={`fw-bold`}>
                        Kode Booking: <span className={`${styles.spanHarga} fw-bold`}>{order.order.kode_booking}</span>
                      </h5>
                    )}
                    <div>
                      <div className="d-flex">
                        {order.tiketBerangkat && <p className="bg-transparent fw-bold border border-light">{order.tiketBerangkat.jam_berangkat}:00</p>}
                        <p className={`${styles.spanHarga} bg-transparent fw-bold ms-auto border border-light`}>Kedatangan</p>
                      </div>
                      {order.tiketBerangkat && <div className={`ms-3`}>{order.tiketBerangkat.tanggal_berangkat}</div>}
                      {order.tiketBerangkat && (
                        <div>
                          <div className={`ms-3`}>{order.tiketBerangkat.bandaraAwal.nama_bandara}</div> <hr />
                        </div>
                      )}
                      {order.penerbanganBerangkat && (
                        <div>
                          <div className={`fw-bold ms-5`}>
                            {order.penerbanganBerangkat.maskapai.nama_maskapai} - {order.penerbanganBerangkat.maskapai.tipe_maskapai}
                          </div>
                          <div className={`fw-bold ms-5`}>{order.penerbanganBerangkat.maskapai.kode_maskapai}</div>
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
                        {order.tiketBerangkat && <p className="bg-transparent fw-bold border border-light">{order.tiketBerangkat.jam_kedatangan}:00</p>}
                        <p className={`${styles.spanHarga} bg-transparent fw-bold ms-auto border border-light`}>Kedatangan</p>
                      </div>
                      {order.tiketBerangkat && <div className={`ms-3`}>{order.tiketBerangkat.tanggal_kedatangan}</div>}
                      {order.tiketBerangkat && (
                        <div>
                          <div className={`ms-3`}>{order.tiketBerangkat.bandaraTujuan.nama_bandara}</div> <hr />
                        </div>
                      )}
                      <div>
                        <div className="fw-bold">Rincian harga</div>
                        <div className="d-flex">
                          <p className="bg-transparent border border-light">Harga Tiket</p>
                          {order.penerbanganBerangkat && (
                            <div className="ms-auto">
                              <p className={`bg-transparent fw-bold ms-auto border border-light  text-end`}>{order.penerbanganBerangkat.maskapai.harga_tiket}</p>
                            </div>
                          )}
                        </div>
                        <div className="d-flex">
                          <p className="bg-transparent border border-light">Jumlah Penumpang</p>
                          {order.order && (
                            <div className="ms-auto">
                              <p className={`bg-transparent fw-bold ms-auto border border-light text-end`}>{order.order.jumlah_penumpang}</p>
                            </div>
                          )}
                        </div>
                        <div className="d-flex">
                          <p className="bg-transparent border border-light fw-bold">Total Harga Tiket</p>
                          {order && (
                            <div className="ms-auto">
                              <p className={`bg-transparent fw-bold ms-auto border border-light text-end`}>{order.totalHargaTiket}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {order.order && order.order.status_pembayaran === 'paid' ? (
                    <Button className={`m-3 fw-bold ${styles.customButton}`}>Cetak Tiket</Button>
                  ) : (
                    <Button
                      className="m-3 fw-bold bg-danger border border-danger"
                      onClick={() => {
                        router.push(`/payment?order=${order.order && order.order.id}`);
                      }}
                    >
                      Lanjut Bayar
                    </Button>
                  )}
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      ) : (
        Swal.fire({
          title: 'Anda belum login',
          text: 'Silakan login terlebih dahulu',
          timer: 3000,
          icon: 'error',
          showConfirmButton: true,
        }).then(() => {
          router.push('/');
        })
      )}
    </div>
  );
};

export default HistoryOrderRoundTrip;
