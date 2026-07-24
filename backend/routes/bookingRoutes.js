const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    getBookingsForMyListings,
    cancelBooking
} = require('../controllers/bookingController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, createBooking);
router.get('/my-bookings', verifyToken, getMyBookings);
router.get('/host-bookings', verifyToken, getBookingsForMyListings);
router.put('/:id/cancel', verifyToken, cancelBooking);

module.exports = router;