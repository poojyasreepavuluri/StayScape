import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createListing, uploadImages } from '../services/listingService';

const CreateListing = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        pricePerNight: '',
        city: '',
        state: '',
        country: '',
        amenities: '',
        maxGuests: 1,
        bedrooms: 1,
        bathrooms: 1
    });
    const [imageFiles, setImageFiles] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImageFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let imageUrls = [];

            if (imageFiles.length > 0) {
                const uploadFormData = new FormData();
                for (let i = 0; i < imageFiles.length; i++) {
                    uploadFormData.append('images', imageFiles[i]);
                }
                const uploadResponse = await uploadImages(uploadFormData);
                imageUrls = uploadResponse.data.imageUrls;
            }

            const listingPayload = {
                title: formData.title,
                description: formData.description,
                pricePerNight: Number(formData.pricePerNight),
                location: {
                    city: formData.city,
                    state: formData.state,
                    country: formData.country
                },
                images: imageUrls,
                amenities: formData.amenities.split(',').map(a => a.trim()).filter(a => a),
                maxGuests: Number(formData.maxGuests),
                bedrooms: Number(formData.bedrooms),
                bathrooms: Number(formData.bathrooms)
            };

            const response = await createListing(listingPayload);
            navigate(`/listings/${response.data.listing._id}`);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create listing');
        }

        setLoading(false);
    };

    const inputStyle = { borderRadius: '10px', padding: '10px 14px' };
    const sectionStyle = { borderRadius: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' };

    return (
        <div className="container my-4" style={{ maxWidth: '700px' }}>
            <button
                onClick={() => navigate(-1)}
                className="btn btn-light btn-sm mb-3 fw-semibold"
                style={{ borderRadius: '20px' }}
            >
                ← Back
            </button>

            <h3 className="fw-bold mb-1">Host a new place</h3>
            <p className="text-muted mb-4">Fill in the details below to list your property</p>

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
                        <input type="text" name="amenities" className="form-control" style={inputStyle} placeholder="WiFi, Pool, Parking" value={formData.amenities} onChange={handleChange} />
                    </div>
                    <div className="mb-0">
                        <label className="form-label small fw-semibold">Images (jpg, png, webp only)</label>
                        <input type="file" className="form-control" style={inputStyle} multiple accept="image/*" onChange={handleFileChange} />
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn w-100 text-white fw-semibold"
                    style={{ backgroundColor: '#ff385c', borderRadius: '10px', padding: '12px' }}
                    disabled={loading}
                >
                    {loading ? 'Creating listing...' : 'Create Listing'}
                </button>
            </form>
        </div>
    );
};

export default CreateListing;