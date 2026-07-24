const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectMongo = require('./config/mongo');
require('./config/mysql');

const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

connectMongo();

app.get('/', (req, res) => {
    res.send('StayScape backend is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);

app.use((err, req, res, next) => {
    if (err.message) {
        return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});