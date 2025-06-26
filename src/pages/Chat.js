import React, { useEffect, useState, useRef } from 'react';
import './Chat.css';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  const fetchUserYear = async () => {
    try {
      const res = await fetch('https://campuslink-4xaw.onrender.com/api/auth/getuser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'auth-token': token }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unauthorized');
      setYear(data.year);
    } catch (err) {
      console.error('❌ Failed to fetch user year:', err.message);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch('https://campuslink-4xaw.onrender.com/api/chat', {
        headers: { 'auth-token': token }
      });
      const data = await res.json();
      if (!res.ok || !Array.isArray(data)) throw new Error('Failed to load messages');
      setMessages(data);
    } catch (err) {
      console.error('❌ Failed to fetch messages:', err.message);
      setMessages([]);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchUserYear();
      await fetchMessages();
      setLoading(false);
    };

    if (token) init();
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await fetch('https://campuslink-4xaw.onrender.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({ text })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Message send failed');
      setMessages(prev => [...prev, data]);
      setText('');
    } catch (err) {
      console.error('❌ Send error:', err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;

    try {
      const res = await fetch(`https://campuslink-4xaw.onrender.com/api/chat/${id}`, {
        method: 'DELETE',
        headers: { 'auth-token': token }
      });

      if (!res.ok) throw new Error('Failed to delete');
      setMessages(prev => prev.filter(msg => msg._id !== id));
    } catch (err) {
      console.error('❌ Delete error:', err.message);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="chat-container">
      <h2>💬 {year ? `${year} Year Chat` : 'Loading...'}</h2>

      <div className="chat-box">
        {messages.length > 0 ? (
          messages.map((msg, idx) => (
            <div key={idx} className="chat-message">
              <div>
                <strong>{msg.name || 'Anonymous'}:</strong>
                <span> {msg.text}</span>
                <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
              </div>
              {msg.user === userId && (
                <button className="delete-btn" onClick={() => handleDelete(msg._id)}>🗑️</button>
              )}
            </div>
          ))
        ) : (
          <p className="no-msg">No messages yet.</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="chat-form">
        <input
          type="text"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;
