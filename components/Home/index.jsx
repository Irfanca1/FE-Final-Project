import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '@/styles/Home.module.css';
import { Row, Col, InputGroup, FormControl, Button } from 'react-bootstrap';
import { GiAirplaneDeparture, GiAirplaneArrival } from 'react-icons/gi';
import { BsFillCalendarDateFill } from 'react-icons/bs';
import { MdAirlineSeatReclineExtra, MdHotelClass } from 'react-icons/md';
import { BsToggleOff, BsToggleOn, BsSearch } from 'react-icons/bs';
import { AiOutlineSwap, AiOutlineArrowRight } from 'react-icons/ai';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import id from 'date-fns/locale/id';
import axios from 'axios';

registerLocale('id', id);

const HalamanUtama = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateReturn, setSelectedDateReturn] = useState(null);
  const [isRoundtrip, setIsRoundtrip] = useState(false);
  const [fromLocation, setFromLocation] = useState('Choose...');
  const [toLocation, setToLocation] = useState('Choose...');
  const [dataDestinations, setDataDestinations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/home');
        const destinations = response.data.data;
        console.log(destinations);
        setDataDestinations(destinations);
      } catch (error) {
        console.log('Error fetching destinations:', error.message);
      }
    };

    fetchData();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleDateChangeReturn = (date) => {
    setSelectedDateReturn(date);
  };

  const handleRoundtripToggle = () => {
    setIsRoundtrip(!isRoundtrip);
    setSelectedDateReturn(null);
  };

  const handleSwapLocations = () => {
    const tempLocation = fromLocation;
    setFromLocation(toLocation);
    setToLocation(tempLocation);
  };

  return (
    <div className="container ">
      <div className={`card ${styles.card} bg-light`} style={{ width: '97%' }}>
        <div className="card-header fs-3 fw-bold bg-light">
          Pilih Jadwal Penerbangan di <span className={`${styles.span}`}> Tiketku</span>
        </div>
        <div className="card-body">
          <Row>
            <Col md={5}>
              <InputGroup className="mb-3">
                <InputGroup.Text>
                  <GiAirplaneDeparture className="me-3" />
                  From
                </InputGroup.Text>
                <FormControl as="select" id="from" value={fromLocation} onChange={(e) => setFromLocation(e.target.value)}>
                  <option selected>Choose...</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </FormControl>
              </InputGroup>
            </Col>
            <Col md={2} className="d-flex justify-content-center align-items-center">
              <Button style={{ backgroundColor: 'rgb(147, 6, 147)', borderColor: 'rgb(182, 24, 182)' }} onClick={handleSwapLocations}>
                <AiOutlineSwap />
              </Button>
            </Col>
            <Col md={5}>
              <InputGroup className="mb-3">
                <InputGroup.Text>
                  <GiAirplaneArrival className="me-3" />
                  To
                </InputGroup.Text>
                <FormControl as="select" id="to" value={toLocation} onChange={(e) => setToLocation(e.target.value)}>
                  <option selected>Choose...</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </FormControl>
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col md={5}>
              <Row>
                <Col>
                  <InputGroup>
                    <InputGroup.Text>
                      <BsFillCalendarDateFill className="me-3" />
                      Date Departure
                    </InputGroup.Text>
                    <DatePicker className="form-control" selected={selectedDate} onChange={handleDateChange} locale="id" dateFormat="dd MMMM yyyy" placeholderText="Pilih tanggal" />
                  </InputGroup>
                </Col>
                <Col>
                  <InputGroup>
                    <InputGroup.Text>
                      <BsFillCalendarDateFill className="me-3" />
                      Date Return
                    </InputGroup.Text>
                    <DatePicker className="form-control" selected={selectedDateReturn} onChange={handleDateChangeReturn} locale="id" dateFormat="dd MMMM yyyy" placeholderText="Pilih tanggal" disabled={!isRoundtrip} />
                  </InputGroup>
                </Col>
              </Row>
            </Col>
            <Col md={2} className="d-flex justify-content-center align-items-center fs-3">
              <div className={isRoundtrip ? styles.roundtripButton + ' active' : styles.roundtripButton} onClick={handleRoundtripToggle}>
                {isRoundtrip ? <BsToggleOn /> : <BsToggleOff />}
              </div>
            </Col>
            <Col md={5}>
              <Col>
                <Row>
                  <Col>
                    <InputGroup>
                      <InputGroup.Text>
                        <MdAirlineSeatReclineExtra className="me-3" />
                        Passenge
                      </InputGroup.Text>
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup>
                      <InputGroup.Text>
                        <MdHotelClass className="me-3" />
                        Seat Class
                      </InputGroup.Text>
                    </InputGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <InputGroup className="mb-3">
                      <FormControl placeholder="Jumlah Penumpang" />
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup className="mb-3">
                      <FormControl as="select" id="to">
                        <option selected>Choose...</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </FormControl>
                    </InputGroup>
                  </Col>
                </Row>
              </Col>
            </Col>
          </Row>
        </div>
        <Button className="fw-bold" style={{ backgroundColor: 'rgb(147, 6, 147)', borderColor: 'rgb(182, 24, 182)' }}>
          Cari Penerbangan
        </Button>
      </div>
      <div className={`fw-bold ${styles.destination} ${styles.description}`}>
        <div className="fs-2">Destination Favorite</div>
        <div className="d-flex p-2">
          <Button className="m-2 fw-bold" style={{ backgroundColor: 'rgb(147, 6, 147)', borderColor: 'rgb(182, 24, 182)' }}>
            <BsSearch className="me-2" /> Semua
          </Button>
          <Button className="m-2 fw-bold" style={{ backgroundColor: 'rgb(147, 6, 147)', borderColor: 'rgb(182, 24, 182)' }}>
            <BsSearch className="me-2" /> Asia
          </Button>
          <Button className="m-2 fw-bold" style={{ backgroundColor: 'rgb(147, 6, 147)', borderColor: 'rgb(182, 24, 182)' }}>
            <BsSearch className="me-2" /> Amerika
          </Button>
          <Button className="m-2 fw-bold" style={{ backgroundColor: 'rgb(147, 6, 147)', borderColor: 'rgb(182, 24, 182)' }}>
            <BsSearch className="me-2" /> Australia
          </Button>
          <Button className="m-2 fw-bold" style={{ backgroundColor: 'rgb(147, 6, 147)', borderColor: 'rgb(182, 24, 182)' }}>
            <BsSearch className="me-2" /> Eropa
          </Button>
          <Button className="m-2 fw-bold" style={{ backgroundColor: 'rgb(147, 6, 147)', borderColor: 'rgb(182, 24, 182)' }}>
            <BsSearch className="me-2" /> Afrika
          </Button>
        </div>
        <Row className="mt-5">
          {dataDestinations.map((destination) => (
            <Col md={4} key={destination.id}>
              <div className="card" style={{ width: '18rem' }}>
                <img src={destination.foto} height={'300px'} alt="Rumah Adat" />
                <div className="card-body">
                  <h5 className="card-title fs-6">
                    {destination.bandaraAwal.kota} <AiOutlineArrowRight /> {destination.bandaraTujuan.kota}
                  </h5>
                  <h6>{destination.maskapai.nama_maskapai}</h6>
                  <h6>
                    Mulai dari <span className="text-danger fw-bold">{destination.maskapai.harga_tiket}</span>
                  </h6>
                </div>
                <Button className="m-2 fw-bold" style={{ backgroundColor: 'rgb(147, 6, 147)', borderColor: 'rgb(182, 24, 182)' }}>
                  Pilih
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default HalamanUtama;
