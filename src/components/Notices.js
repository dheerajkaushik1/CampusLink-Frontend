import React, { useEffect, useState } from 'react';
import './Notices.css';
import { useNavigate } from 'react-router-dom';

function Notices() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ title: '', description: '' });

  /* 💡 1. — GET all notices */
  useEffect(() => {
    const fetchNotices = async () => {
      const response = await fetch('https://campuslink-4xaw.onrender.com/api/notices');
      const data = await response.json();
      setNotices(data);
    };
    fetchNotices();
  }, []);

  /* 💡 2. — DELETE a notice */
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;

    const response = await fetch(`https://campuslink-4xaw.onrender.com/api/notices/${id}`, {
      method: 'DELETE',
      headers: { 'auth-token': localStorage.getItem('token') },
    });

    const data = await response.json();
    if (response.ok) {
      alert('Notice deleted!');
      setNotices((prev) => prev.filter((n) => n._id !== id));
    } else {
      alert(data.msg || 'Error deleting notice');
    }
  };

  /* 💡 3. — Edit helpers */
  const handleEditClick = (notice) => {
    setEditId(notice._id);
    setEditData({ title: notice.title, description: notice.description });
  };
  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };
  const handleEditSave = async (id) => {
    const response = await fetch(`https://campuslink-4xaw.onrender.com/api/notices/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
      body: JSON.stringify(editData),
    });

    const data = await response.json();
    if (response.ok) {
      alert('Notice updated!');
      setNotices((prev) => prev.map((n) => (n._id === id ? { ...n, ...editData } : n)));
      setEditId(null);
    } else {
      alert(data.msg || 'Error updating notice');
    }
  };

  return (
    <div className="notices-container">
      <h2>📢 Campus Notices</h2>
      {notices.length === 0 ? (
        <p>No notices available.</p>
      ) : (
        <>
          <ul className="notice-list">
            {notices.map((notice) => (
              <li key={notice._id} className="notice-item">
                {/* header */}
                <div className="notice-header">
                  {editId === notice._id ? (
                    <input
                      type="text"
                      name="title"
                      value={editData.title}
                      onChange={handleEditChange}
                    />
                  ) : (
                    <h4>{notice.title}</h4>
                  )}
                  <small>{new Date(notice.uploadedAt).toLocaleDateString()}</small>
                </div>

                {/* description */}
                {editId === notice._id ? (
                  <textarea
                    name="description"
                    value={editData.description}
                    onChange={handleEditChange}
                  />
                ) : (
                  <p>{notice.description}</p>
                )}

                {/* attachment */}
                {notice.fileUrl && (
                  <a
                    href={`https://campuslink-4xaw.onrender.com${notice.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    📎 View Attachment
                  </a>
                )}

                {/* actions */}
                <div className="notice-actions">
                  {editId === notice._id ? (
                    <>
                      <button onClick={() => handleEditSave(notice._id)}>💾 Save</button>
                      <button onClick={() => setEditId(null)}>❌ Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditClick(notice)}>✏️ Edit</button>
                      <button onClick={() => handleDelete(notice._id)}>🗑️ Delete</button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <button onClick={() => navigate('/upload-notice')} className="upload-btn">
        Upload New Notice
      </button>
    </div>
  );
}

export default Notices;
