const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bycrpt = require('bcryptjs');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./src/config/db/db.connection');

dotenv.config({ path: './.env' });

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode.`);
});