import { useState, useEffect } from 'react';
import { getMyBookings, cancelBooking } from '../services/bookingService';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await getMyBookings();
            setBookings(response.data.bookings);
        } catch (err) {
            setError('Failed to load bookings');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await cancelBooking(bookingId);
            fetchBookings();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel booking');
        }
    };

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

    if (loading) return <div className="container mt-4"><p>Loading...</p></div>;

    return (
        <div className="container mt-4">
            <button
                onClick={() => navigate(-1)}
                className="btn btn-light btn-sm mb-3 fw-semibold"
                style={{ borderRadius: '20px' }}
            >
                ← Back
            </button>
            <h3 className="mb-4">My Bookings</h3>
            {error && <div className="alert alert-danger">{error}</div>}

            {bookings.length === 0 ? (
                <p>You have no bookings yet.</p>
            ) : (
                bookings.map(booking => (
                    <div className="card mb-3 shadow-sm" key={booking._id}>
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <h5>{booking.listingId?.title || 'Listing removed'}</h5>
                                <p className="mb-1">
                                    {formatDate(booking.checkInDate)} to {formatDate(booking.checkOutDate)}
                                    &nbsp;|&nbsp; {booking.totalGuests} guests
                                </p>
                                <p className="mb-1">Total: ₹{booking.totalPrice}</p>
                                <span className={`badge bg-${booking.status === 'confirmed' ? 'success' : booking.status === 'cancelled' ? 'danger' : 'secondary'}`}>
                                    {booking.status}
                                </span>
                            </div>
                            {booking.status === 'confirmed' && (
                                <button className="btn btn-outline-danger btn-sm" onClick={() => handleCancel(booking._id)}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default MyBookings;