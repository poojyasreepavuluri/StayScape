import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg bg-white sticky-top px-4 py-3" style={{ borderBottom: '1px solid #eee' }}>
            <Link className="navbar-brand fw-bold fs-4" to="/" style={{ color: '#ff385c' }}>
                StayScape
            </Link>

            <div className="ms-auto d-flex align-items-center gap-4">
                <Link to="/" className="text-decoration-none text-dark fw-medium">Explore</Link>

                {user ? (
                    <>
                        <Link to="/my-listings" className="text-decoration-none text-dark fw-medium">My Listings</Link>
                        <Link to="/host-bookings" className="text-decoration-none text-dark fw-medium">Host Bookings</Link>
                        <Link to="/my-bookings" className="text-decoration-none text-dark fw-medium">My Bookings</Link>
                        <Link to="/create-listing" className="btn btn-sm fw-medium" style={{ backgroundColor: '#222', color: '#fff', borderRadius: '20px', padding: '6px 16px' }}>
                            Host a Home
                        </Link>

                        <div className="d-flex align-items-center gap-2 ps-3" style={{ borderLeft: '1px solid #ddd' }}>
                            <Link to="/profile" style={{ textDecoration: 'none' }}>
                                <div
                                    className="d-flex align-items-center justify-content-center fw-semibold"
                                    style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#ff385c', color: '#fff', fontSize: '14px', cursor: 'pointer' }}
                                >
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            </Link>
                            <button className="btn btn-sm btn-outline-secondary" onClick={handleLogout}>Logout</button>
                        </div>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-sm btn-outline-dark" style={{ borderRadius: '20px', padding: '6px 16px' }}>Login</Link>
                        <Link to="/signup" className="btn btn-sm" style={{ backgroundColor: '#ff385c', color: '#fff', borderRadius: '20px', padding: '6px 16px' }}>Signup</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;