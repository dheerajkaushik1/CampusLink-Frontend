import React, { useEffect, useState, useRef } from 'react';
import './Chat.css';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [year, setYear] = useState('');
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem('token');
  const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

  const fetchUserYear = async () => {
    const res = await fetch('https://campuslink-4xaw.onrender.com/api/auth/getuser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'auth-token': token }
    });
    const data = await res.json();
    if (res.ok && data.year) {
      setYear(data.year);
    }
  };

  const fetchMessages = async () => {
    const res = await fetch('https://campuslink-4xaw.onrender.com/api/chat', {
      headers: { 'auth-token': token }
    });
    const data = await res.json();
    setMessages(data);
  };

  useEffect(() => {
    fetchUserYear();     
    fetchMessages();     
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const res = await fetch('https://campuslink-4xaw.onrender.com/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token
      },
      body: JSON.stringify({ text })  
    });

    const data = await res.json();
    if (res.ok) {
      setMessages(prev => [...prev, data]);
      setText('');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;

    const res = await fetch(`https://campuslink-4xaw.onrender.com/api/chat/${id}`, {
      method: 'DELETE',
      headers: { 'auth-token': token }
    });

    if (res.ok) {
      setMessages(prev => prev.filter(msg => msg._id !== id));
    }
  };

  return (
    <div className="chat-container">
      <h2>💬 {year ? `${year} Year Chat` : 'Loading...'}</h2>

      <div className="chat-box">
        {messages.map((msg, idx) => (
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
        ))}
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
