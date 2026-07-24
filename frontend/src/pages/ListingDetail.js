import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListingById } from '../services/listingService';
import { createBooking } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import ImageGalleryModal from '../components/ImageGalleryModal';


const ListingDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingData, setBookingData] = useState({ checkInDate: '', checkOutDate: '', totalGuests: 1 });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [booking, setBooking] = useState(false);
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [galleryStartIndex, setGalleryStartIndex] = useState(0);

    useEffect(() => {
        const fetchListing = async () => {
            setLoading(true);
            try {
                const response = await getListingById(id);
                setListing(response.data.listing);
            } catch (err) {
                setError('Listing not found');
            }
            setLoading(false);
        };
        fetchListing();
    }, [id]);

    const handleChange = (e) => {
        setBookingData({ ...bookingData, [e.target.name]: e.target.value });
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!user) {
            navigate('/login');
            return;
        }

        setBooking(true);
        try {
            await createBooking({ listingId: id, ...bookingData });
            setSuccess('Booking confirmed! Check "My Bookings" to view it.');
            setBookingData({ checkInDate: '', checkOutDate: '', totalGuests: 1 });
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        }
        setBooking(false);
    };

    const calculateNights = () => {
        if (!bookingData.checkInDate || !bookingData.checkOutDate) return 0;
        const nights = (new Date(bookingData.checkOutDate) - new Date(bookingData.checkInDate)) / (1000 * 60 * 60 * 24);
        return nights > 0 ? nights : 0;
    };

    if (loading) return <div className="container mt-5"><p className="text-center text-muted">Loading...</p></div>;
    if (error && !listing) return <div className="container mt-5"><p className="text-center text-danger">{error}</p></div>;

    const nights = calculateNights();
    const totalPrice = nights * listing.pricePerNight;
    const mainImage = listing.images && listing.images.length > 0 ? listing.images[0] : 'https://via.placeholder.com/900x500?text=No+Image';
    const otherImages = listing.images && listing.images.length > 1 ? listing.images.slice(1, 5) : [];

   return (
        <div className="container mt-4 mb-5">
            <button
                onClick={() => navigate(-1)}
                className="btn btn-light btn-sm mb-3 fw-semibold"
                style={{ borderRadius: '20px' }}
            >
                ← Back
            </button>
            <h2 className="fw-bold mb-1">{listing.title}</h2>
            <p className="text-muted mb-4">{listing.location.city}, {listing.location.state}, {listing.location.country}</p>

           <div className="row g-2 mb-4" style={{ borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
                <div className={otherImages.length > 0 ? 'col-md-8' : 'col-md-12'}>
                    <img
                        src={mainImage}
                        alt={listing.title}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover', maxHeight: '460px', cursor: 'pointer' }}
                        onClick={() => { setGalleryStartIndex(0); setGalleryOpen(true); }}
                    />
                </div>
                {otherImages.length > 0 && (
                    <div className="col-md-4">
                        <div className="row g-2 h-100">
                            {otherImages.map((img, index) => (
                                <div className="col-6" key={index}>
                                    <img
                                        src={img}
                                        alt={`${listing.title} ${index}`}
                                        className="w-100 h-100"
                                        style={{ objectFit: 'cover', maxHeight: '224px', cursor: 'pointer' }}
                                        onClick={() => { setGalleryStartIndex(index + 1); setGalleryOpen(true); }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {listing.images && listing.images.length > 1 && (
                    <button
                        onClick={() => { setGalleryStartIndex(0); setGalleryOpen(true); }}
                        className="btn btn-light btn-sm fw-semibold"
                        style={{ position: 'absolute', bottom: '16px', right: '16px', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
                    >
                        Show all {listing.images.length} photos
                    </button>
                )}
            </div>

            {galleryOpen && (
                <ImageGalleryModal
                    images={listing.images}
                    startIndex={galleryStartIndex}
                    onClose={() => setGalleryOpen(false)}
                />
            )}

            <div className="row">
                <div className="col-lg-7">
                    <div className="pb-4 mb-4" style={{ borderBottom: '1px solid #eee' }}>
                        <h5 className="fw-semibold mb-3">About this place</h5>
                        <p className="text-muted" style={{ lineHeight: '1.7' }}>{listing.description}</p>
                    </div>

                    <div className="pb-4 mb-4" style={{ borderBottom: '1px solid #eee' }}>
                        <h5 className="fw-semibold mb-3">Property details</h5>
                        <div className="row">
                            <div className="col-4">
                                <p className="mb-0 text-muted small">Guests</p>
                                <p className="fw-semibold">{listing.maxGuests}</p>
                            </div>
                            <div className="col-4">
                                <p className="mb-0 text-muted small">Bedrooms</p>
                                <p className="fw-semibold">{listing.bedrooms}</p>
                            </div>
                            <div className="col-4">
                                <p className="mb-0 text-muted small">Bathrooms</p>
                                <p className="fw-semibold">{listing.bathrooms}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h5 className="fw-semibold mb-3">Amenities</h5>
                        {listing.amenities && listing.amenities.length > 0 ? (
                            <div className="d-flex flex-wrap gap-2">
                                {listing.amenities.map((item, index) => (
                                    <span key={index} className="badge text-dark fw-normal px-3 py-2" style={{ backgroundColor: '#f0f0f0', borderRadius: '20px', fontSize: '0.85rem' }}>
                                        {item}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted">No amenities listed</p>
                        )}
                    </div>
                </div>

                <div className="col-lg-5">
                    <div
                        className="card border-0 p-4"
                        style={{
                            borderRadius: '16px',
                            boxShadow: '0 2px 16px rgba(0,0,0,0.1)',
                            position: 'sticky',
                            top: '90px'
                        }}
                    >
                        <div className="d-flex align-items-baseline mb-3">
                            <span className="fs-4 fw-bold">₹{listing.pricePerNight}</span>
                            <span className="text-muted ms-1"> / night</span>
                        </div>

                        {error && <div className="alert alert-danger py-2">{error}</div>}
                        {success && <div className="alert alert-success py-2">{success}</div>}

                        <form onSubmit={handleBooking}>
                            <div className="row g-2 mb-2">
                                <div className="col-6">
                                    <label className="form-label small text-muted mb-1">Check-in</label>
                                    <input type="date" name="checkInDate" className="form-control" value={bookingData.checkInDate} onChange={handleChange} required />
                                </div>
                                <div className="col-6">
                                    <label className="form-label small text-muted mb-1">Check-out</label>
                                    <input type="date" name="checkOutDate" className="form-control" value={bookingData.checkOutDate} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label small text-muted mb-1">Guests</label>
                                <input type="number" name="totalGuests" className="form-control" min="1" max={listing.maxGuests} value={bookingData.totalGuests} onChange={handleChange} required />
                            </div>

                            {nights > 0 && (
                                <div className="mb-3 pb-3" style={{ borderBottom: '1px solid #eee' }}>
                                    <div className="d-flex justify-content-between text-muted mb-1">
                                        <span>₹{listing.pricePerNight} x {nights} nights</span>
                                        <span>₹{totalPrice}</span>
                                    </div>
                                    <div className="d-flex justify-content-between fw-bold mt-2">
                                        <span>Total</span>
                                        <span>₹{totalPrice}</span>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn w-100 text-white fw-semibold py-2"
                                style={{ backgroundColor: '#ff385c', borderRadius: '10px' }}
                                disabled={booking}
                            >
                                {booking ? 'Booking...' : user ? 'Book Now' : 'Login to Book'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingDetail;