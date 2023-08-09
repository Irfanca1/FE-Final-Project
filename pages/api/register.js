const axios = require('axios');

export default async (req, res) => {
  if (req.method === 'POST') {
    const { username, password, confirmPassword, nama_lengkap, alamat, email, nomor_telepon } = req.body;

    try {
      const response = await axios.post('http://localhost:5000/v1/api/register-use-otp', {
        username,
        password,
        confirmPassword,
        nama_lengkap,
        alamat,
        email,
        nomor_telepon,
      });

      res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        const { status, data } = error.response;
        res.status(status).json(data);
      } else {
        console.log(error);
        res.status(500).json({ error: `Error: ${error.message}` });
      }
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
