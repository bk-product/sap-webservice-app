const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


app.post('/proxy-sap', async (req, res) => {
  const { username, password, soapRequest } = req.body;

  try {
    console.log("Sending request to SAP service with username:", username);

    const response = await axios.post(process.env.SAP_SERVICE_URL, soapRequest, {
      auth: { username, password },
      headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': process.env.SAP_FM,
      },
      timeout: 10000,
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error in proxy request:', error);

    if (error.response) {
      res.status(500).send(`SAP Error: ${error.response.status} - ${error.response.statusText}`);
    } else if (error.code === 'ECONNABORTED') {
      res.status(500).send('Request timeout or SAP service unavailable.');
    } else {
      res.status(500).send('Network error or SAP service unavailable.');
    }
  }
});


app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
