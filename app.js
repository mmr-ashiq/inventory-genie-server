const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bycrpt = require('bcryptjs');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./src/config/db/db.connection');
const routes = require('./src/modules/core/rootRouter');

dotenv.config({ path: './.env' });

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(morgan('common'));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// routes
app.use(routes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode.`);
});