import { useState, useEffect } from 'react';
import { getAllListings } from '../services/listingService';
import ListingCard from '../components/ListingCard';

const Home = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ city: '', minPrice: '', maxPrice: '', guests: '' });

    const fetchListings = async (appliedFilters = {}) => {
        setLoading(true);
        try {
            const response = await getAllListings(appliedFilters);
            setListings(response.data.listings);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const handleReset = () => {
        setFilters({ city: '', minPrice: '', maxPrice: '', guests: '' });
        fetchListings();
    };

    useEffect(() => {
        fetchListings();
    }, []);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const activeFilters = {};
        Object.keys(filters).forEach(key => {
            if (filters[key]) activeFilters[key] = filters[key];
        });
        fetchListings(activeFilters);
    };

    return (
        <div>
            <div style={{ backgroundColor: '#fff5f6', borderBottom: '1px solid #eee' }} className="py-5 mb-4">
                <div className="container text-center">
                    <h1 className="fw-bold mb-2" style={{ fontSize: '2.4rem' }}>Find your next stay</h1>
                    <p className="text-muted mb-4">Search unique homes, cabins, and villas across India</p>

                    <form onSubmit={handleSearch} className="bg-white shadow-sm rounded-pill p-2 d-flex flex-wrap gap-2 justify-content-center mx-auto" style={{ maxWidth: '900px' }}>
                        <input
                            type="text"
                            name="city"
                            placeholder="Where to?"
                            className="form-control border-0"
                            style={{ flex: '2', minWidth: '160px' }}
                            value={filters.city}
                            onChange={handleFilterChange}
                        />
                        <input
                            type="number"
                            name="minPrice"
                            placeholder="Min ₹"
                            className="form-control border-0"
                            style={{ flex: '1', minWidth: '100px' }}
                            value={filters.minPrice}
                            onChange={handleFilterChange}
                        />
                        <input
                            type="number"
                            name="maxPrice"
                            placeholder="Max ₹"
                            className="form-control border-0"
                            style={{ flex: '1', minWidth: '100px' }}
                            value={filters.maxPrice}
                            onChange={handleFilterChange}
                        />
                        <input
                            type="number"
                            name="guests"
                            placeholder="Guests"
                            className="form-control border-0"
                            style={{ flex: '1', minWidth: '100px' }}
                            value={filters.guests}
                            onChange={handleFilterChange}
                        />
                        <button type="submit" className="btn text-white px-4" style={{ backgroundColor: '#ff385c', borderRadius: '30px' }}>
                            Search
                        </button>
                        <button type="button" onClick={handleReset} className="btn btn-outline-secondary px-3" style={{ borderRadius: '30px' }}>
                            Reset
                        </button>
                    </form>
                </div>
            </div>

            <div className="container mb-5">
                {loading ? (
                    <p className="text-center text-muted mt-5">Loading listings...</p>
                ) : listings.length === 0 ? (
                    <div className="text-center mt-5">
                        <p className="text-muted fs-5">No listings found matching your search.</p>
                    </div>
                ) : (
                    <div className="row">
                        {listings.map(listing => (
                            <ListingCard key={listing._id} listing={listing} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;