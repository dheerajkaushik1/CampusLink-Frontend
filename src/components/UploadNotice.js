import React, { useState } from 'react';
import './UploadNotice.css';
import { useNavigate } from 'react-router-dom';

function UploadNotice() {
  const navigate = useNavigate();
  const [notice, setNotice] = useState({ title: '', description: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setNotice({ ...notice, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', notice.title);
    formData.append('description', notice.description);
    formData.append('file', file);

    try {
      const res = await fetch(
        'https://campuslink-4xaw.onrender.com/api/notices/upload',
        {
          method: 'POST',
          headers: {
            'auth-token': localStorage.getItem('token'),
          },
          body: formData,
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert('✅ Notice uploaded successfully!');
        navigate('/notices');
      } else {
        alert(data.msg || '❌ Failed to upload notice.');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
        ></textarea>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.jpg,.png"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Notice'}
        </button>
      </form>
    </div>
  );
}

export default UploadNotice;
