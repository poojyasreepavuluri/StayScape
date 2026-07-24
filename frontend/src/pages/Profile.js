import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, loginUser } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name || '', phone: user.phone || '' });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSaving(true);

        try {
            const response = await updateProfile(formData);
            const token = localStorage.getItem('token');
            loginUser(response.data.user, token);
            setSuccess('Profile updated successfully');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        }

        setSaving(false);
    };

    if (!user) return null;

    const inputStyle = { borderRadius: '10px', padding: '10px 14px' };
    const sectionStyle = { borderRadius: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' };

    return (
        <div className="container my-4" style={{ maxWidth: '600px' }}>
            <button
                onClick={() => navigate(-1)}
                className="btn btn-light btn-sm mb-3 fw-semibold"
                style={{ borderRadius: '20px' }}
            >
                ← Back
            </button>

            <div className="d-flex align-items-center gap-3 mb-4">
                <div
                    className="d-flex align-items-center justify-content-center fw-semibold"
                    style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#ff385c', color: '#fff', fontSize: '1.5rem' }}
                >
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h4 className="fw-bold mb-0">{user.name}</h4>
                    <p className="text-muted mb-0">{user.email}</p>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="bg-white p-4" style={sectionStyle}>
                <h6 className="fw-semibold mb-3">Edit Profile</h6>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label small fw-semibold">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            style={inputStyle}
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label small fw-semibold">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            style={{ ...inputStyle, backgroundColor: '#f7f7f7' }}
                            value={user.email}
                            disabled
                        />
                        <small className="text-muted">Email cannot be changed</small>
                    </div>

                    <div className="mb-4">
                        <label className="form-label small fw-semibold">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            className="form-control"
                            style={inputStyle}
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn text-white fw-semibold px-4"
                        style={{ backgroundColor: '#ff385c', borderRadius: '10px', padding: '10px' }}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;