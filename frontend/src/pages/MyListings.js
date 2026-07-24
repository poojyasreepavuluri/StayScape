import { useState, useEffect } from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import { getMyListings, deleteListing } from '../services/listingService';

const MyListings = () => {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchListings = async () => {
        setLoading(true);
        try {
            const response = await getMyListings();
            setListings(response.data.listings);
        } catch (err) {
            setError('Failed to load your listings');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchListings();
    }, []);

    const handleDelete = async (listingId) => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return;
        try {
            await deleteListing(listingId);
            fetchListings();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete listing');
        }
    };

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
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>My Listings</h3>
                <Link to="/create-listing" className="btn btn-danger">+ Add New Listing</Link>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}

            {listings.length === 0 ? (
                <p>You haven't listed any properties yet.</p>
            ) : (
                listings.map(listing => (
                    <div className="card mb-3 shadow-sm" key={listing._id}>
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <h5>{listing.title}</h5>
                                <p className="mb-1 text-muted">{listing.location.city}, {listing.location.state}</p>
                                <p className="mb-0">₹{listing.pricePerNight} / night</p>
                            </div>
                            <div className="d-flex gap-2">
                                <Link to={`/listings/${listing._id}`} className="btn btn-outline-secondary btn-sm">View</Link>
                                <Link to={`/edit-listing/${listing._id}`} className="btn btn-outline-primary btn-sm">Edit</Link>
                                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(listing._id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default MyListings;