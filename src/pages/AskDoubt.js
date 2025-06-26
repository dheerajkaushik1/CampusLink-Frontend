import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AskDoubt.css';
import Loading from '../components/Loading'; // Make sure this exists

function AskDoubt() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // loading state
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      setMessage('⚠️ Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('https://campuslink-4xaw.onrender.com/api/doubts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({ title, description })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.msg || 'Something went wrong');

      setMessage('✅ Doubt submitted successfully!');
      setTimeout(() => {
        navigate('/doubts');
      }, 1500);
    } catch (err) {
      console.error('❌ Submission error:', err);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ask-doubt-container">
      <h2>📝 Ask a Doubt</h2>
      {loading ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit} className="ask-doubt-form">
          <input
            type="text"
            placeholder="Doubt Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Explain your doubt in detail"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <button type="submit">Submit Doubt</button>
          {message && <p className="message">{message}</p>}
        </form>
      )}
    </div>
  );
}

export default AskDoubt;
