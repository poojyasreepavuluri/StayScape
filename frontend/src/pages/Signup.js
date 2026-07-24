import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await signup(formData);
            loginUser(response.data.user, response.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed, please try again');
        }

        setLoading(false);
    };

    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '85vh', backgroundColor: '#f7f7f7' }}>
            <div className="bg-white p-4 p-md-5" style={{ maxWidth: '420px', width: '100%', borderRadius: '16px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
                <h3 className="fw-bold text-center mb-1">Create your account</h3>
                <p className="text-muted text-center mb-4" style={{ fontSize: '0.9rem' }}>Join StayScape to book or host stays</p>

                {error && <div className="alert alert-danger py-2">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label small fw-semibold">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            style={{ borderRadius: '10px', padding: '10px 14px' }}
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label small fw-semibold">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            style={{ borderRadius: '10px', padding: '10px 14px' }}
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label small fw-semibold">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            style={{ borderRadius: '10px', padding: '10px 14px' }}
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label small fw-semibold">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            className="form-control"
                            style={{ borderRadius: '10px', padding: '10px 14px' }}
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn w-100 text-white fw-semibold"
                        style={{ backgroundColor: '#ff385c', borderRadius: '10px', padding: '10px' }}
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Signup'}
                    </button>
                </form>

                <p className="text-center mt-4 mb-0" style={{ fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" className="fw-semibold" style={{ color: '#ff385c' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;