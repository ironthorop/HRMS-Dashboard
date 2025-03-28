const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('HRMS Dashboard Server');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
