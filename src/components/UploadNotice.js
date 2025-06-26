import React, { useState, useEffect } from 'react';
import './UploadNotice.css';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading'; // Adjust the path if needed

function UploadNotice() {
  const navigate = useNavigate();
  const [notice, setNotice] = useState({ title: '', description: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔑 Redirect if no token
  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/login');
  }, [navigate]);

  const handleChange = (e) => setNotice({ ...notice, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file to upload.');

    setLoading(true);
    const formData = new FormData();
    formData.append('title', notice.title);
    formData.append('description', notice.description);
    formData.append('file', file);

    try {
      const res = await fetch('https://campuslink-4xaw.onrender.com/api/notices/upload', {
        method: 'POST',
        headers: { 'auth-token': localStorage.getItem('token') },
        body: formData,
      });

      const ct = res.headers.get('content-type');
      if (!res.ok) {
        const errTxt = await res.text();
        throw new Error(`❌ ${res.status}: ${errTxt}`);
      }
      if (!ct || !ct.includes('application/json')) {
        const raw = await res.text();
        throw new Error(`❌ Unexpected response: ${raw.slice(0, 100)}`);
      }

      await res.json();
      alert('✅ Notice uploaded successfully!');
      setNotice({ title: '', description: '' });
      setFile(null);
      document.getElementById('file-input').value = '';
      navigate('/notices');
    } catch (err) {
      console.error(err);
      alert(err.message || '❌ Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="page-wrapper">
      <div className="upload-notice-container">
        <h2>📤 Upload New Notice</h2>
        <form onSubmit={handleSubmit} className="upload-notice-form">
          <input
            type="text"
            name="title"
            placeholder="Notice Title"
            value={notice.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Notice Description"
            value={notice.description}
            onChange={handleChange}
            required
          />
          <input
            id="file-input"
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.png"
            onChange={handleFileChange}
            required
          />
          <button type="submit">
            Upload Notice
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadNotice;
