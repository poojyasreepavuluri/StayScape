const express = require('express');
const router = express.Router();
const {
    createListing,
    getAllListings,
    getListingById,
    updateListing,
    deleteListing,
    getMyListings
} = require('../controllers/listingController');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getAllListings);
router.get('/my-listings', verifyToken, getMyListings);
router.get('/:id', getListingById);
router.post('/', verifyToken, createListing);
router.post('/upload-images', verifyToken, upload.array('images', 5), (req, res) => {
    const imageUrls = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
    res.status(200).json({ imageUrls });
});
router.put('/:id', verifyToken, updateListing);
router.delete('/:id', verifyToken, deleteListing);

module.exports = router;