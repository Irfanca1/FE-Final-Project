import React, { useState } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import styles from '@/styles/Home.module.css';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    try {
      const response = await axios.post('/api/login', formData);
      console.log(response.data.data.accessToken);
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('token', response.data.data.accessToken);
      Cookies.set('accessToken', response.data.data.accessToken);
      localStorage.setItem('token', response.data.data.accessToken);

      Swal.fire({
        title: response.data.message,
        text: '',
        icon: 'success',
        timer: 3000,
        showConfirmButton: true,
      }).then(() => {
        router.push('/');
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

  const handleClickForgotPassword = () => {
    router.push('/otp/forgotPassword');
  };

  return (
    <div className={`${styles.description}`} style={{ height: '0px' }}>
      <Row>
        <Col md={6}>
          <img src="/auth-background.png" alt="auth background" className="img-fluid" />
        </Col>
        <Col md={6} className="p-5">
          <Form onSubmit={handleSubmit}>
            <h2 className="mb-4">Login</h2>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" className="text-dark fw-bold" value={formData.email} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} />
            </Form.Group>
            <Button style={{ width: '100%', backgroundColor: 'rgb(1, 1, 255)', borderColor: 'rgb(1, 1, 255)' }} className="mt-4 fw-bold" type="submit">
              {isLoading ? 'Loading...' : 'Login'}
            </Button>
            <p className="bg-transparent border border-light fs-6 text-center ">
              Belum punya akun?{' '}
              <Button onClick={() => router.push('/auth/register')} className="fw-bold bg-transparent border border-light" style={{ color: 'rgb(1, 1, 255)' }}>
                Daftar di sini
              </Button>
            </p>
          </Form>
          <p className="bg-transparent border border-light fs-6 text-center ">
            Lupa Password?{' '}
            <Button onClick={handleClickForgotPassword} className="fw-bold bg-transparent border border-light" style={{ color: 'rgb(1, 1, 255)' }}>
              Klik di sini
            </Button>
          </p>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
