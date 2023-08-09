import React, { useState } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import styles from '@/styles/Home.module.css';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nama_lengkap: '',
    alamat: '',
    email: '',
    nomor_telepon: '',
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        title: 'Password tidak sesuai!',
        text: 'Silakan cek kembali!',
        icon: 'error',
        timer: 3000,
        showConfirmButton: true,
      });
      setIsLoading(false);
    }

    try {
      const response = await axios.post('/api/register', formData);
      Swal.fire({
        title: response.data.message,
        text: 'Silakan cek email anda!',
        icon: 'success',
        timer: 3000,
        showConfirmButton: true,
      }).then(() => {
        router.push(`/otp?email=${encodeURIComponent(formData.email)}`);
      });
    } catch (error) {
      Swal.fire({
        title: error.response.data.message,
        text: 'Internal server error',
        icon: 'error',
        timer: 3000,
        showConfirmButton: true,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className={`${styles.description}`} style={{ height: '0px' }}>
      <Row>
        <Col md={6}>
          <img src="/auth-background.png" alt="auth background" className="img-fluid" />
        </Col>
        <Col md={6} className="p-5">
          <Form onSubmit={handleSubmit}>
            <h2 className="mb-4">Register</h2>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" name="username" className="text-dark fw-bold" value={formData.username} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="nama_lengkap">
              <Form.Label>Nama Lengkap</Form.Label>
              <Form.Control type="text" name="nama_lengkap" className="text-dark fw-bold" value={formData.nama_lengkap} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="alamat">
              <Form.Label>Alamat</Form.Label>
              <Form.Control as="textarea" name="alamat" className="text-dark fw-bold" value={formData.alamat} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" className="text-dark fw-bold" value={formData.email} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="nomor_telepon">
              <Form.Label>Nomor Telepon</Form.Label>
              <Form.Control type="text" name="nomor_telepon" className="text-dark fw-bold" value={formData.nomor_telepon} onChange={handleChange} />
            </Form.Group>
            <Button style={{ width: '100%', backgroundColor: 'rgb(1, 1, 255)', borderColor: 'rgb(1, 1, 255)' }} className="mt-4 fw-bold" type="submit">
              {isLoading ? 'Loading...' : 'Register'}
            </Button>
            <p className="bg-transparent border border-light fs-6 text-center ">
              Sudah punya akun?{' '}
              <Button onClick={() => router.push('/auth/login')} className="fw-bold bg-transparent border border-light" style={{ color: 'rgb(1, 1, 255)' }}>
                Masuk di sini
              </Button>
            </p>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
