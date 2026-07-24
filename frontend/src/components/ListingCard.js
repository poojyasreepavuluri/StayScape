import { Link } from 'react-router-dom';

const ListingCard = ({ listing }) => {
    const imageUrl = listing.images && listing.images.length > 0
        ? listing.images[0]
        : 'https://via.placeholder.com/400x250?text=No+Image';

    return (
        <div className="col-md-4 mb-4">
            <Link to={`/listings/${listing._id}`} className="text-decoration-none text-dark">
                <div
                    className="card h-100 border-0"
                    style={{
                        borderRadius: '16px',
                        overflow: 'hidden',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)';
                    }}
                >
                    <img
                        src={imageUrl}
                        className="card-img-top"
                        alt={listing.title}
                        style={{ height: '220px', objectFit: 'cover' }}
                    />
                    <div className="card-body">
                        <h6 className="fw-semibold mb-1">{listing.title}</h6>
                        <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                            {listing.location.city}, {listing.location.state}
                        </p>
                        <p className="mb-0">
                            <span className="fw-bold">₹{listing.pricePerNight}</span>
                            <span className="text-muted"> / night</span>
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ListingCard;