const express = require('express');
const env = require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 7000;
const MONGO_URL = process.env.MONGO_URL;

const userRouter = require('./routes/userRouter');
const shortUrlRouter = require('./routes/shortUrlRouter');
const analyticsRouter = require('./routes/analyticsRouter');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// {
//   origin: ["https://form-bot-blue.vercel.app"],
//   methods: ["POST", "GET", "PUT","PATCH", "DELETE"],
//   credentials: true
// }
app.use(morgan('tiny'));

app.use('/api', userRouter, shortUrlRouter, analyticsRouter);

app.get('/', (req, res) => {
  return res.status(200).send('HELLO FROM SNAPLINK SERVER');
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

  mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('connected to mongoDb');
  }).catch((err) => {
    console.log('error connecting to mongoDb', err);
  });
});