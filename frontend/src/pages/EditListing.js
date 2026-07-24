import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListingById, updateListing, uploadImages } from '../services/listingService';

const EditListing = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '', description: '', pricePerNight: '', city: '', state: '', country: '',
        amenities: '', maxGuests: 1, bedrooms: 1, bathrooms: 1
    });
    const [existingImages, setExistingImages] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const response = await getListingById(id);
                const listing = response.data.listing;
                setFormData({
                    title: listing.title,
                    description: listing.description,
                    pricePerNight: listing.pricePerNight,
                    city: listing.location.city,
                    state: listing.location.state,
                    country: listing.location.country,
                    amenities: listing.amenities.join(', '),
                    maxGuests: listing.maxGuests,
                    bedrooms: listing.bedrooms,
                    bathrooms: listing.bathrooms
                });
                setExistingImages(listing.images || []);
            } catch (err) {
                setError('Failed to load listing');
            }
            setLoading(false);
        };
        fetchListing();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImageFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            let imageUrls = existingImages;

            if (imageFiles.length > 0) {
                const uploadFormData = new FormData();
                for (let i = 0; i < imageFiles.length; i++) {
                    uploadFormData.append('images', imageFiles[i]);
                }
                const uploadResponse = await uploadImages(uploadFormData);
                imageUrls = [...existingImages, ...uploadResponse.data.imageUrls];
            }

            const listingPayload = {
                title: formData.title,
                description: formData.description,
                pricePerNight: Number(formData.pricePerNight),
                location: { city: formData.city, state: formData.state, country: formData.country },
                images: imageUrls,
                amenities: formData.amenities.split(',').map(a => a.trim()).filter(a => a),
                maxGuests: Number(formData.maxGuests),
                bedrooms: Number(formData.bedrooms),
                bathrooms: Number(formData.bathrooms)
            };

            await updateListing(id, listingPayload);
            navigate(`/listings/${id}`);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update listing');
        }
        setSaving(false);
    };

    const inputStyle = { borderRadius: '10px', padding: '10px 14px' };
    const sectionStyle = { borderRadius: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' };

    if (loading) return <div className="container mt-5"><p className="text-center text-muted">Loading...</p></div>;

    return (
        <div className="container my-4" style={{ maxWidth: '700px' }}>
            <button
                onClick={() => navigate(-1)}
                className="btn btn-light btn-sm mb-3 fw-semibold"
                style={{ borderRadius: '20px' }}
            >
                ← Back
            </button>

            <h3 className="fw-bold mb-1">Edit listing</h3>
            <p className="text-muted mb-4">Update your property details below</p>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="bg-white p-4 mb-3" style={sectionStyle}>
                    <h6 className="fw-semibold mb-3">Basic Information</h6>
                    <div className="mb-3">
                        <label className="form-label small fw-semibold">Title</label>
                        <input type="text" name="title" className="form-control" style={inputStyle} value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className="mb-0">
                        <label className="form-label small fw-semibold">Description</label>
                        <textarea name="description" className="form-control" style={inputStyle} rows="3" value={formData.description} onChange={handleChange} required />
                    </div>
                </div>

                <div className="bg-white p-4 mb-3" style={sectionStyle}>
                    <h6 className="fw-semibold mb-3">Location</h6>
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label className="form-label small fw-semibold">City</label>
                            <input type="text" name="city" className="form-control" style={inputStyle} value={formData.city} onChange={handleChange} required />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label small fw-semibold">State</label>
                            <input type="text" name="state" className="form-control" style={inputStyle} value={formData.state} onChange={handleChange} required />
                        </div>
                        <div className="col-md-4 mb-0">
                            <label className="form-label small fw-semibold">Country</label>
                            <input type="text" name="country" className="form-control" style={inputStyle} value={formData.country} onChange={handleChange} required />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 mb-3" style={sectionStyle}>
                    <h6 className="fw-semibold mb-3">Pricing & Capacity</h6>
                    <div className="mb-3">
                        <label className="form-label small fw-semibold">Price per night (₹)</label>
                        <input type="number" name="pricePerNight" className="form-control" style={inputStyle} value={formData.pricePerNight} onChange={handleChange} required />
                    </div>
                    <div className="row">
                        <div className="col-md-4 mb-3 mb-md-0">
                            <label className="form-label small fw-semibold">Max Guests</label>
                            <input type="number" name="maxGuests" className="form-control" style={inputStyle} min="1" value={formData.maxGuests} onChange={handleChange} required />
                        </div>
                        <div className="col-md-4 mb-3 mb-md-0">
                            <label className="form-label small fw-semibold">Bedrooms</label>
                            <input type="number" name="bedrooms" className="form-control" style={inputStyle} min="1" value={formData.bedrooms} onChange={handleChange} required />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small fw-semibold">Bathrooms</label>
                            <input type="number" name="bathrooms" className="form-control" style={inputStyle} min="1" value={formData.bathrooms} onChange={handleChange} required />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 mb-3" style={sectionStyle}>
                    <h6 className="fw-semibold mb-3">Amenities & Photos</h6>
                    <div className="mb-3">
                        <label className="form-label small fw-semibold">Amenities (comma separated)</label>
                        <input type="text" name="amenities" className="form-control" style={inputStyle} value={formData.amenities} onChange={handleChange} />
                    </div>

                    {existingImages.length > 0 && (
                        <div className="mb-3">
                            <label className="form-label small fw-semibold d-block">Current Images</label>
                            <div className="d-flex flex-wrap gap-2">
                                {existingImages.map((img, i) => (
                                    <img key={i} src={img} alt="listing" style={{ height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mb-0">
                        <label className="form-label small fw-semibold">Add more images (optional)</label>
                        <input type="file" className="form-control" style={inputStyle} multiple accept="image/*" onChange={handleFileChange} />
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn w-100 text-white fw-semibold"
                    style={{ backgroundColor: '#ff385c', borderRadius: '10px', padding: '12px' }}
                    disabled={saving}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default EditListing;