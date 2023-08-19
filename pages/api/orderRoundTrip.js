const axios = require('axios');

export default async (req, res) => {
  if (req.method === 'POST') {
    const { id_penerbangan_berangkat, id_penerbangan_pulang, nama_lengkap, nama_keluarga, nomor_telepon, email, jumlah_penumpang, kursi } = req.body;
    const { headers } = req;
    try {
      const response = await axios.post(
        'http://localhost:5000/v1/api/order-round-trip',
        {
          id_penerbangan_berangkat,
          id_penerbangan_pulang,
          nama_lengkap,
          nama_keluarga,
          nomor_telepon,
          email,
          jumlah_penumpang,
          kursi,
        },
        {
          headers: {
            Authorization: headers.authorization,
          },
        }
      );
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
