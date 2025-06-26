import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Loading from '../components/Loading'; 

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); 

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>📚 Welcome to CampusLink</h1>
        <p>Your one-stop hub for notes, notices, doubt-solving & chat with friends.</p>
        
        <div className="home-buttons">
          <button onClick={() => navigate('/notes')}>📄 View Notes</button>
          <button onClick={() => navigate('/notices')}>📢 See Notices</button>
          <button onClick={() => navigate('/chat')}>💬 Open Chat</button>
          <button onClick={() => navigate('/doubts')}>❓ Ask a Doubt</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
