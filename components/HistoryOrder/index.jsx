import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import styles from '@/styles/Home.module.css';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { FaLocationDot } from 'react-icons/fa';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button, Card, Col, Row, Spinner } from 'react-bootstrap';
import { LuMoveHorizontal } from 'react-icons/lu';

const HistoryOrder = ({ accessToken }) => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [dataId, setDataId] = useState(null);
  const [order, setOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const handleCardClick = (orderId) => {
    setSelectedOrderId(orderId);
  };

  const handleClickBerandaa = () => {
    router.push('/');
    setIsLoading(false);
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
        setIsLoading(false);
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
        setIsLoading(false);
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
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
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
              <div onClick={handleClickBerandaa} style={{ cursor: 'pointer' }}>
                <AiOutlineArrowLeft /> Beranda
              </div>
            </div>
          </div>
          <div>
            {isLoading ? (
              // Tampilkan animasi loading selama data dimuat
              <div className="text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : data.length > 0 ? (
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
                      <h5 className={`${styles.spanHarga} fw-bold`}>Detail Pesanan Berangkat</h5>
                      {order.order && (
                        <h5 className={`fw-bold`}>
                          Kode Booking: <span className={`${styles.spanHarga} fw-bold`}>{order.order.kode_booking}</span>
                        </h5>
                      )}
                      <div>
                        <div className="d-flex">
                          {order.tiket && <p className="bg-transparent fw-bold border border-light">{order.tiket.berangkat.jam_berangkat}</p>}
                          <p className={`${styles.spanHarga} bg-transparent fw-bold ms-auto border border-light`}>Keberangkatan</p>
                        </div>
                        {order.tiket && <div className={`ms-3`}>{order.tiket.berangkat.tanggal_berangkat}</div>}
                        {order.tiket && (
                          <div>
                            <div className={`ms-3`}>{order.tiket.berangkat.bandaraAwal.nama_bandara}</div> <hr />
                          </div>
                        )}
                        {order.tiket && (
                          <div>
                            <div className={`fw-bold ms-5`}>
                              {order.tiket.berangkat.maskapai.nama_maskapai} - {order.tiket.berangkat.maskapai.tipe_maskapai}
                            </div>
                            <div className={`fw-bold ms-5`}>{order.tiket.berangkat.maskapai.kode_maskapai}</div>
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
                          {order.tiket && <p className="bg-transparent fw-bold border border-light">{order.tiket.berangkat.jam_kedatangan}</p>}
                          <p className={`${styles.spanHarga} bg-transparent fw-bold ms-auto border border-light`}>Kedatangan</p>
                        </div>
                        {order.tiket && <div className={`ms-3`}>{order.tiket.berangkat.tanggal_kedatangan}</div>}
                        {order.tiket && (
                          <div>
                            <div className={`ms-3`}>{order.tiket.berangkat.bandaraTujuan.nama_bandara}</div> <hr />
                          </div>
                        )}
                        <div>
                          <div className="fw-bold">Rincian harga</div>
                          <div className="d-flex">
                            <p className="bg-transparent border border-light">Harga Tiket</p>
                            {order.tiket && (
                              <div className="ms-auto">
                                <p className={`bg-transparent fw-bold ms-auto border border-light  text-end`}>{order.tiket.berangkat.maskapai.harga_tiket}</p>
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
                            <p className="bg-transparent border border-light">Total Harga Tiket Berangkat</p>
                            {order.tiket && (
                              <div className="ms-auto">
                                <p className={`bg-transparent fw-bold ms-auto border border-light  text-end`}>{order.tiket.berangkat.totalHargaTiketBerangkat}</p>
                              </div>
                            )}
                          </div>
                          {order.tiket && (
                            <div>
                              {order.tiket.pulang.id_penerbangan ? (
                                <>
                                  <h5 className={`${styles.spanHarga} fw-bold mt-5`}>Detail Pesanan Pulang</h5>
                                  <div className="d-flex">
                                    {order.tiket.pulang && <p className="bg-transparent fw-bold border border-light">{order.tiket.pulang.jam_berangkat}</p>}
                                    <p className={`${styles.spanHarga} bg-transparent fw-bold ms-auto border border-light`}>Keberangkatan</p>
                                  </div>
                                  {order.tiket.pulang && <div className={`ms-3`}>{order.tiket.pulang.tanggal_berangkat}</div>}
                                  {order.tiket.pulang && (
                                    <div>
                                      <div className={`ms-3`}>{order.tiket.pulang.bandaraAwal.nama_bandara}</div> <hr />
                                    </div>
                                  )}
                                  {order.tiket.pulang && (
                                    <div>
                                      <div className={`fw-bold ms-5`}>
                                        {order.tiket.pulang.maskapai.nama_maskapai} - {order.tiket.pulang.maskapai.tipe_maskapai}
                                      </div>
                                      <div className={`fw-bold ms-5`}>{order.tiket.pulang.maskapai.kode_maskapai}</div>
                                    </div>
                                  )}
                                  <div className="d-block ms-5">
                                    <div className={`fw-bold`}>Informasi : </div>
                                    <div>Baggage 20 kg </div>
                                    <div>Cabin Baggage 7 kg </div>
                                    <div>In Flight Entertainment </div>
                                  </div>{' '}
                                  <hr />
                                  <div className="d-flex">
                                    {order.tiket.pulang && <p className="bg-transparent fw-bold border border-light">{order.tiket.pulang.jam_kedatangan}</p>}
                                    <p className={`${styles.spanHarga} bg-transparent fw-bold ms-auto border border-light`}>Kedatangan</p>
                                  </div>
                                  {order.tiket && <div className={`ms-3`}>{order.tiket.pulang.tanggal_kedatangan}</div>}
                                  {order.tiket && (
                                    <div>
                                      <div className={`ms-3`}>{order.tiket.pulang.bandaraTujuan.nama_bandara}</div> <hr />
                                    </div>
                                  )}
                                  <div className="fw-bold">Rincian harga</div>
                                  <div className="d-flex">
                                    <p className="bg-transparent border border-light">Harga Tiket</p>
                                    {order.tiket && (
                                      <div className="ms-auto">
                                        <p className={`bg-transparent fw-bold ms-auto border border-light  text-end`}>{order.tiket.pulang.maskapai.harga_tiket}</p>
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
                                    <p className="bg-transparent border border-light">Total Harga Tiket Pulang</p>
                                    {order.tiket && (
                                      <div className="ms-auto">
                                        <p className={`bg-transparent fw-bold ms-auto border border-light  text-end`}>{order.tiket.pulang.totalHargaTiketPulang}</p>
                                      </div>
                                    )}
                                  </div>
                                </>
                              ) : (
                                ''
                              )}
                            </div>
                          )}

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
            ) : (
              <div className={`${styles.description} fs-2 fw-bold text-center`}>Tidak ada histori pemesanan</div>
            )}
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

export default HistoryOrder;
