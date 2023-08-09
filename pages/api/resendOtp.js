const axios = require('axios');

export default async (req, res) => {
  if (req.method === 'POST') {
    const { email } = req.body;

    try {
      const response = await axios.post('http://localhost:5000/v1/api/resend-otp', {
        email,
      });

      res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        const { status, data } = error.response;
        res.status(status).json(data);
        console.log(error.response);
      } else {
        console.log(error);
        res.status(500).json({ error: `Error: ${error.message}` });
        console.log(error.response);
      }
    }
  }
};
