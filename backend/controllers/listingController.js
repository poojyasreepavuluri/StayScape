const Listing = require('../models/mongo/Listing');

const createListing = async (req, res) => {
    try {
        const { title, description, pricePerNight, location, images, amenities, maxGuests, bedrooms, bathrooms } = req.body;

        if (!title || !description || !pricePerNight || !location) {
            return res.status(400).json({ message: 'Title, description, price and location are required' });
        }

        const newListing = new Listing({
            title,
            description,
            pricePerNight,
            location,
            images,
            amenities,
            maxGuests,
            bedrooms,
            bathrooms,
            hostId: req.userId
        });

        await newListing.save();

        res.status(201).json({
            message: 'Listing created successfully',
            listing: newListing
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating listing' });
    }
};

const getAllListings = async (req, res) => {
    try {
        const { city, minPrice, maxPrice, guests } = req.query;

        const filter = {};

        if (city) {
            filter['location.city'] = { $regex: city, $options: 'i' };
        }

        if (minPrice || maxPrice) {
            filter.pricePerNight = {};
            if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
            if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
        }

        if (guests) {
            filter.maxGuests = { $gte: Number(guests) };
        }

        const listings = await Listing.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ listings });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching listings' });
    }
};

const getListingById = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        res.status(200).json({ listing });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching listing' });
    }
};

const updateListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        if (listing.hostId !== req.userId) {
            return res.status(403).json({ message: 'You are not authorized to update this listing' });
        }

        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.status(200).json({
            message: 'Listing updated successfully',
            listing: updatedListing
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating listing' });
    }
};

const deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        if (listing.hostId !== req.userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this listing' });
        }

        await Listing.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Listing deleted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting listing' });
    }
};

const getMyListings = async (req, res) => {
    try {
        const listings = await Listing.find({ hostId: req.userId }).sort({ createdAt: -1 });
        res.status(200).json({ listings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching your listings' });
    }
};

module.exports = {
    createListing,
    getAllListings,
    getListingById,
    updateListing,
    deleteListing,
    getMyListings
};