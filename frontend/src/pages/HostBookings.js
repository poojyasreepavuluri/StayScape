import { useState, useEffect } from 'react';
import { getHostBookings } from '../services/bookingService';
import { useNavigate } from 'react-router-dom';


const HostBookings = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            try {
                const response = await getHostBookings();
                setBookings(response.data.bookings);
            } catch (err) {
                setError('Failed to load bookings');
            }
            setLoading(false);
        };
        fetchBookings();
    }, []);

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
            <h3 className="mb-4">Bookings on my listings</h3>
            {error && <div className="alert alert-danger">{error}</div>}

            {bookings.length === 0 ? (
                <p>No one has booked your listings yet.</p>
            ) : (
                bookings.map(booking => (
                    <div className="card mb-3 shadow-sm" key={booking._id}>
                        <div className="card-body">
                            <h5>{booking.listingId?.title || 'Listing removed'}</h5>
                            <p className="mb-1 text-muted">
                                Booked by: {booking.guest ? `${booking.guest.name} (${booking.guest.email})` : 'Unknown guest'}
                            </p>
                            <p className="mb-1">
                                {formatDate(booking.checkInDate)} to {formatDate(booking.checkOutDate)}
                                &nbsp;|&nbsp; {booking.totalGuests} guests
                            </p>
                            <p className="mb-1">Total: ₹{booking.totalPrice}</p>
                            <span className={`badge bg-${booking.status === 'confirmed' ? 'success' : booking.status === 'cancelled' ? 'danger' : 'secondary'}`}>
                                {booking.status}
                            </span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default HostBookings;