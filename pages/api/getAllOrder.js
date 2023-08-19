const axios = require('axios');

export default async (req, res) => {
  if (req.method === 'GET') {
    const { headers } = req;
    try {
      const response = await axios.get('http://localhost:5000/v1/api/get-all-order', {
        headers: {
          Authorization: headers.authorization,
        },
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
