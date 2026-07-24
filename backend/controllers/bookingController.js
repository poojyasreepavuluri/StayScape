const Booking = require('../models/mongo/Booking');
const Listing = require('../models/mongo/Listing');
const { findUserById } = require('../models/mysql/userModel');

const checkAvailability = async (listingId, checkInDate, checkOutDate) => {
    const overlappingBooking = await Booking.findOne({
        listingId,
        status: { $ne: 'cancelled' },
        checkInDate: { $lt: checkOutDate },
        checkOutDate: { $gt: checkInDate }
    });
    return !overlappingBooking;
};

const createBooking = async (req, res) => {
    try {
        const { listingId, checkInDate, checkOutDate, totalGuests } = req.body;

        if (!listingId || !checkInDate || !checkOutDate) {
            return res.status(400).json({ message: 'Listing, check-in and check-out dates are required' });
        }

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkIn < today) {
            return res.status(400).json({ message: 'Check-in date cannot be in the past' });
        }

        if (checkOut <= checkIn) {
            return res.status(400).json({ message: 'Check-out date must be after check-in date' });
        }

        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        if (listing.hostId === req.userId) {
            return res.status(400).json({ message: 'You cannot book your own listing' });
        }

        if (totalGuests && totalGuests > listing.maxGuests) {
            return res.status(400).json({ message: `This listing allows a maximum of ${listing.maxGuests} guests` });
        }

        const isAvailable = await checkAvailability(listingId, checkIn, checkOut);
        if (!isAvailable) {
            return res.status(400).json({ message: 'This listing is already booked for the selected dates' });
        }

        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const totalPrice = nights * listing.pricePerNight;

        const newBooking = new Booking({
            listingId,
            guestId: req.userId,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            totalGuests: totalGuests || 1,
            totalPrice
        });

        await newBooking.save();

        res.status(201).json({
            message: 'Booking confirmed successfully',
            booking: newBooking
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating booking' });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ guestId: req.userId })
            .populate('listingId')
            .sort({ createdAt: -1 });
        res.status(200).json({ bookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching bookings' });
    }
};

const getBookingsForMyListings = async (req, res) => {
    try {
        const myListings = await Listing.find({ hostId: req.userId }).select('_id');
        const listingIds = myListings.map(listing => listing._id);

        const bookings = await Booking.find({ listingId: { $in: listingIds } })
            .populate('listingId')
            .sort({ createdAt: -1 });

        const bookingsWithGuestInfo = await Promise.all(
            bookings.map(async (booking) => {
                const guest = await findUserById(booking.guestId);
                return {
                    ...booking.toObject(),
                    guest: guest ? { name: guest.name, email: guest.email, phone: guest.phone } : null
                };
            })
        );

        res.status(200).json({ bookings: bookingsWithGuestInfo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching bookings' });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.guestId !== req.userId) {
            return res.status(403).json({ message: 'You are not authorized to cancel this booking' });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json({ message: 'Booking cancelled successfully', booking });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error cancelling booking' });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getBookingsForMyListings,
    cancelBooking
};