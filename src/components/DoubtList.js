import React, { useEffect, useState } from 'react';
import './DoubtList.css';
import { useNavigate, Link } from 'react-router-dom';
import Loading from '../components/Loading';

function DoubtList() {
    const [doubts, setDoubts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [showMyDoubtsOnly, setShowMyDoubtsOnly] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        fetchUser();
        fetchDoubts();
    }, [token, navigate]);

    const fetchUser = async () => {
        try {
            const res = await fetch('https://campuslink-4xaw.onrender.com/api/auth/getuser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            });

            const data = await res.json();
            setIsAdmin(data.isAdmin);
            setCurrentUserId(data._id);
        } catch (err) {
            console.error('❌ User fetch error:', err);
        }
    };

    const fetchDoubts = async () => {
        try {
            const res = await fetch('https://campuslink-4xaw.onrender.com/api/doubts', {
                headers: { 'auth-token': token }
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.msg || 'Failed to load doubts');
            setDoubts(data);
        } catch (err) {
            console.error('❌ Fetch error:', err);
            setDoubts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this doubt?')) return;

        try {
            const res = await fetch(`https://campuslink-4xaw.onrender.com/api/doubts/${id}`, {
                method: 'DELETE',
                headers: { 'auth-token': token }
            });

            if (!res.ok) throw new Error('Delete failed');
            setDoubts(prev => prev.filter(d => d._id !== id));
        } catch (err) {
            console.error('❌ Delete error:', err);
        }
    };

    const filteredDoubts = showMyDoubtsOnly
        ? doubts.filter(d => d.user === currentUserId)
        : doubts;

    if (loading) return <Loading />;

    return (
        <div className="doubt-list-container">
            <div className="doubt-header-bar">
                <h2>📚 All Doubts</h2>
                <div className="doubt-controls">
                    <button className="ask-doubt-btn" onClick={() => navigate('/ask-doubt')}>
                        ➕ Ask Doubt
                    </button>
                    <label className="my-doubts-toggle">
                        <input
                            type="checkbox"
                            checked={showMyDoubtsOnly}
                            onChange={() => setShowMyDoubtsOnly(prev => !prev)}
                        />
                        <strong>My Doubts Only</strong>
                    </label>
                </div>
            </div>

            {filteredDoubts.length === 0 ? (
                <p>{showMyDoubtsOnly ? 'You have not submitted any doubts.' : 'No doubts submitted yet.'}</p>
            ) : (
                <ul className="doubt-list">
                    {filteredDoubts.map(doubt => (
                        <li key={doubt._id} className="doubt-item">
                            <div className="doubt-header">
                                <strong>{doubt.name}</strong>
                                <small>{new Date(doubt.createdAt).toLocaleString()}</small>
                            </div>
                            <h4>
                                <Link to={`/doubts/${doubt._id}`} className="doubt-title-link">
                                    {doubt.title}
                                </Link>
                            </h4>
                            <p>{doubt.description}</p>

                            <div className="doubt-actions">
                                {(doubt.user === currentUserId || isAdmin) && (
                                    <button onClick={() => handleDelete(doubt._id)} className="delete-doubt-btn">
                                        🗑️ Delete
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DoubtList;
