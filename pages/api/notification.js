import axios from 'axios';

export default async (req, res) => {
  if (req.method === 'GET') {
    try {
      if (req.headers.authorization) {
        const response = await axios.get('http://localhost:5000/v1/api/notification', {
          headers: {
            Authorization: req.headers.authorization,
          },
        });

        res.status(response.status).json(response.data);
      } else {
        const response = await axios.get('http://localhost:5000/v1/api/notification');
        res.status(response.status).json(response.data);
      }
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
