import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import './DoubtDetail.css';

function DoubtDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [doubt, setDoubt] = useState(null);
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(true);
    const [myId, setMyId] = useState('');

    useEffect(() => {
        if (!token) return navigate('/login');
        getUserId();
        fetchDoubt();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const getUserId = async () => {
        try {
            const res = await fetch('https://campuslink-4xaw.onrender.com/api/auth/getuser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            });
            const data = await res.json();
            setMyId(data._id);
        } catch (err) {
            console.error('User fetch error:', err);
        }
    };

    const fetchDoubt = async () => {
        try {
            const res = await fetch(`https://campuslink-4xaw.onrender.com/api/doubts/${id}`, {
                headers: { 'auth-token': token }
            });
            const data = await res.json();
            setDoubt(data);
        } catch (err) {
            console.error('❌ Failed to load doubt:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAnswer = async (e) => {
        e.preventDefault();
        if (!answer.trim()) return;

        try {
            const res = await fetch(`https://campuslink-4xaw.onrender.com/api/doubts/${id}/answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({ text: answer })
            });

            const data = await res.json();
            setDoubt(data);
            setAnswer('');
        } catch (err) {
            console.error('❌ Failed to add answer:', err);
        }
    };

    const handleDeleteAnswer = async (answerId) => {
        try {
            const res = await fetch(`https://campuslink-4xaw.onrender.com/api/doubts/${id}/answer/${answerId}`, {
                method: 'DELETE',
                headers: { 'auth-token': token }
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText);
            }

            const data = await res.json();
            setDoubt(data.doubt);
        } catch (err) {
            console.error('❌ Failed to delete answer:', err.message || err);
        }
    };

    if (loading) return <Loading />;
    if (!doubt) return <p>❌ Doubt not found</p>;

    return (
        <div className="doubt-detail-container">
            <div className="doubt-box">
                <h2>{doubt.title}</h2>
                <p>{doubt.description}</p>
                <small>Posted by: <strong>{doubt.name}</strong> on {new Date(doubt.createdAt).toLocaleString()}</small>
            </div>

            <form onSubmit={handleAddAnswer} className="answer-form">
                <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Write your answer..."
                    required
                />
                <button type="submit">Submit Answer</button>
            </form>

            <h3>Answers</h3>
            <ul className="answer-list">
                {doubt.answers.length === 0 ? (
                    <p style={{ color: '#007bff' }}><strong>No answers yet. </strong></p>
                ) : (
                    doubt.answers.map((ans) => (
                        <li key={ans._id} className="answer-item">
                            <p>{ans.text}</p>
                            <small>
                                — <strong>{ans.name || 'Unknown'}</strong> at{' '}
                                {ans.createdAt ? new Date(ans.createdAt).toLocaleString() : 'unknown'}
                            </small>
                            {ans.user === myId && (
                                <button onClick={() => handleDeleteAnswer(ans._id)} className="delete-answer-btn">
                                    🗑️ Delete
                                </button>
                            )}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}

export default DoubtDetail;
