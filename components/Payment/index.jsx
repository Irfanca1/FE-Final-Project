import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import Swal from 'sweetalert2';
import styles from '@/styles/Home.module.css';

const Payment = ({ accessToken }) => {
  const router = useRouter();
  const { order } = router.query;
  const [data, setData] = useState([]);

  const [formData, setFormData] = useState({
    id: order,
    card_number: '',
    card_name: '',
    cvv: '',
    expiry_date: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const detailOrder = async () => {
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

      try {
        const response = await axios.get(`http://localhost:5000/v1/api/get-order-round-trip/${order}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setData(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.log(error.response);
      }
    };
    detailOrder();
  }, [order]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      const response = await axios.post(`/api/payment`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      Swal.fire({
        title: response.data.message,
        text: '',
        icon: 'success',
        timer: 3000,
        showConfirmButton: true,
      }).then(() => {
        router.push('/historyorder');
      });
    } catch (error) {
      console.log(error.res);
      Swal.fire({
        title: error.response.data.message,
        text: 'Silakan cek kembali',
        icon: 'error',
        timer: 3000,
        showConfirmButton: true,
      });
    }
  };

  return (
    <div>
      {accessToken ? (
        <Row>
          <Col md={7} className="mb-3" style={{ width: '40rem' }}>
            <Card>
              <Card.Body>
                <Card.Title className="fw-bold">Isi Data Pembayaran</Card.Title>
                <Form>
                  <Form.Group controlId="metodePembayaran" className="mb-3">
                    <Form.Label>Metode Pembayaran</Form.Label>
                    <Form.Control as="select" name="metodePembayaran" onChange={handleInputChange}>
                      <option value="">Pilih Metode Pembayaran</option>
                      <option value="kartuKredit">Kartu Kredit</option>
                      <option value="transferBank">Transfer Bank</option>
                    </Form.Control>
                  </Form.Group>
                  {formData.metodePembayaran === 'kartuKredit' && (
                    <div>
                      <div className="d-flex justify-content-center mt-3 mb-3">
                        <img src="/mastercard-og-image.png" width={'100px'} height={'100px'} alt="Master Card" />
                        <img src="/044330300_1607510715-paypal.jpg" width={'100px'} height={'100px'} alt="Master Card" />
                      </div>
                      <Form.Group controlId="card_number " className="mb-3 mt-3">
                        <Form.Label>Card Number</Form.Label>
                        <Form.Control type="text" name="card_number" value={formData.card_number} onChange={handleInputChange} placeholder="4089 0000 0000 0000" />
                      </Form.Group>
                      <Form.Group controlId="card_name" className="mb-3 mt-3">
                        <Form.Label>Card Holder Name</Form.Label>
                        <Form.Control type="text" name="card_name" value={formData.card_name} onChange={handleInputChange} placeholder="John Doe" />
                      </Form.Group>
                      <Row>
                        <Col md={6}>
                          <Form.Group controlId="cvv" className="mb-3 mt-3">
                            <Form.Label>CVV</Form.Label>
                            <Form.Control type="text" name="cvv" value={formData.cvv} onChange={handleInputChange} placeholder="123" />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId="expiry_date" className="mb-3 mt-3">
                            <Form.Label>Expiry Date</Form.Label>
                            <Form.Control type="text" name="expiry_date" value={formData.expiry_date} onChange={handleInputChange} placeholder="12/23" />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  )}
                  {formData.metodePembayaran === 'transferBank' && (
                    <div>
                      <div>Silakan transfer ke rekening berikut:</div>
                      <div>Nomor Rekening: xxx-xxx-xxx</div>
                      <div>Bank: Bank ABC</div>
                    </div>
                  )}
                  <Button type="submit" variant="primary" onClick={handleSubmit}>
                    Submit
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md={5} className="mb-3" style={{ width: '27rem' }}>
            <Card>
              <Card className="mb-3">
                <div className="mt-4 p-2">
                  <h5 className={`${styles.spanHarga} fw-bold`}>Detail Penerbangan Berangkat</h5>
                  {data.order && (
                    <h5 className={`fw-bold`}>
                      Kode Booking: <span className={`${styles.spanHarga} fw-bold`}>{data.order.kode_booking}</span>
                    </h5>
                  )}
                  <div>
                    <div className="d-flex">
                      {data.tiket && <div className="bg-transparent fw-bold border border-light ms-3">{data.tiket.berangkat.jam_berangkat}</div>}
                      <div className={`${styles.spanHarga} bg-transparent fw-bold ms-auto border border-light`}>Kedatangan</div>
                    </div>
                    {data.tiket && <div className={`ms-3`}>{data.tiket.berangkat.tanggal_berangkat}</div>}
                    {data.tiket && (
                      <div>
                        <div className={`ms-3`}>{data.tiket.berangkat.bandaraAwal.nama_bandara}</div> <hr />
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
                      {data.tiket && <div className="bg-transparent fw-bold border border-light ms-3">{data.tiket.berangkat.jam_kedatangan}</div>}
                      <div className={`${styles.spanHarga} bg-transparent fw-bold ms-auto border border-light`}>Kedatangan</div>
                    </div>
                    {data.tiket && <div className={`ms-3`}>{data.tiket.berangkat.tanggal_kedatangan}</div>}
                    {data.tiket && (
                      <div>
                        <div className={`ms-3`}>{data.tiket.berangkat.bandaraTujuan.nama_bandara}</div> <hr />
                      </div>
                    )}
                    <div>
                      <div className="fw-bold ms-3 mb-3">Rincian harga</div>
                      <div className="d-flex">
                        <div className="bg-transparent border border-light ms-3 mb-2">Harga Tiket</div>
                        {data.tiket && (
                          <div className="ms-auto">
                            <div className={`bg-transparent fw-bold ms-auto border border-light  text-end`}>{data.tiket.berangkat.maskapai.harga_tiket}</div>
                          </div>
                        )}
                      </div>
                      <div className="d-flex">
                        <div className="bg-transparent border border-light ms-3 mb-2">Jumlah Penumpang</div>
                        {data.order && (
                          <div className="ms-auto">
                            <div className={`bg-transparent fw-bold ms-auto border border-light text-end`}>{data.order.jumlah_penumpang}</div>
                          </div>
                        )}
                      </div>
                      <div className="d-flex">
                        <div className="bg-transparent border border-light ms-3 mb-2">Total Harga Tiket Berangkat</div>
                        {data.tiket && (
                          <div className="ms-auto">
                            <div className={`bg-transparent fw-bold ms-auto border border-light  text-end`}>{data.tiket.berangkat.totalHargaTiketBerangkat}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {data.tiket && (
                    <div>
                      {data.tiket.pulang.id_penerbangan ? (
                        <>
                          <h5 className={`${styles.spanHarga} fw-bold mt-5`}>Detail Penerbangan Pulang</h5>
                          <div className="d-flex">
                            {data.tiket.pulang && <div className="bg-transparent fw-bold border border-light ms-3">{data.tiket.pulang.jam_berangkat}</div>}
                            <div className={`${styles.spanHarga} bg-transparent fw-bold ms-auto border border-light`}>Keberangkatan</div>
                          </div>
                          {data.tiket.pulang && <div className={`ms-3`}>{data.tiket.pulang.tanggal_berangkat}</div>}
                          {data.tiket.pulang && (
                            <div>
                              <div className={`ms-3`}>{data.tiket.pulang.bandaraTujuan.nama_bandara}</div> <hr />
                            </div>
                          )}
                          {data.tiket.pulang && (
                            <div>
                              <div className={`fw-bold ms-5`}>
                                {data.tiket.pulang.maskapai.nama_maskapai} - {data.tiket.pulang.maskapai.tipe_maskapai}
                              </div>
                              <div className={`fw-bold ms-5`}>{data.tiket.pulang.maskapai.kode_maskapai}</div>
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
                            {data.tiket.pulang && <div className="bg-transparent fw-bold border border-light ms-3">{data.tiket.pulang.jam_kedatangan}</div>}
                            <div className={`${styles.spanHarga} bg-transparent fw-bold ms-auto border border-light`}>Kedatangan</div>
                          </div>
                          {data.tiket && <div className={`ms-3`}>{data.tiket.pulang.tanggal_kedatangan}</div>}
                          {data.tiket && (
                            <div>
                              <div className={`ms-3`}>{data.tiket.pulang.bandaraAwal.nama_bandara}</div> <hr />
                            </div>
                          )}
                          <div className="fw-bold ms-3 mb-3">Rincian harga</div>
                          <div className="d-flex">
                            <div className="bg-transparent border border-light ms-3 mb-2">Harga Tiket</div>
                            {data.tiket && (
                              <div className="ms-auto">
                                <div className={`bg-transparent fw-bold ms-auto border border-light  text-end`}>{data.tiket.pulang.maskapai.harga_tiket}</div>
                              </div>
                            )}
                          </div>
                          <div className="d-flex">
                            <div className="bg-transparent border border-light ms-3 mb-2">Jumlah Penumpang</div>
                            {data.order && (
                              <div className="ms-auto">
                                <div className={`bg-transparent fw-bold ms-auto border border-light text-end`}>{data.order.jumlah_penumpang}</div>
                              </div>
                            )}
                          </div>
                          <div className="d-flex">
                            <div className="bg-transparent border border-light ms-3 mb-2">Total Harga Tiket Pulang</div>
                            {data.tiket && (
                              <div className="ms-auto">
                                <div className={`bg-transparent fw-bold ms-auto border border-light  text-end`}>{data.tiket.pulang.totalHargaTiketPulang}</div>
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
                    <div className="bg-transparent border border-light fw-bold ms-3">Total Harga Tiket</div>
                    {data && (
                      <div className="ms-auto">
                        <div className={`bg-transparent fw-bold ms-auto border border-light text-end`}>{data.totalHargaTiket}</div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </Card>
          </Col>
        </Row>
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

export default Payment;
