import React, { useState, useEffect } from 'react';
import './UploadNote.css';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading'; // ⬅️ Make sure this path is correct

function UploadNote() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Admin check on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    fetch('https://campuslink-4xaw.onrender.com/api/auth/getuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token
      }
    })
      .then(res => res.json())
      .then(data => {
        if (!data.isAdmin) {
          alert('⛔ Access Denied: Admins Only');
          navigate('/');
        }
      })
      .catch(() => {
        alert('⛔ Failed to verify user');
        navigate('/');
      })
      .finally(() => setAuthLoading(false));
  }, [navigate]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !description || !pdfFile) {
      setMessage('⚠️ Please fill all fields and select a PDF');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('pdf', pdfFile);

    try {
      setIsUploading(true);
      const res = await fetch('https://campuslink-4xaw.onrender.com/api/notes/uploadnotes', {
        method: 'POST',
        headers: {
          'auth-token': localStorage.getItem('token')
        },
        body: formData
      });

      const contentType = res.headers.get('content-type');

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`❌ Server Error (${res.status}): ${errorText}`);
      }

      if (!contentType || !contentType.includes('application/json')) {
        const raw = await res.text();
        throw new Error(`❌ Unexpected response: ${raw.slice(0, 100)}`);
      }

      await res.json();
      setMessage('✅ Note uploaded successfully!');
      setTitle('');
      setDescription('');
      setPdfFile(null);
      document.getElementById('pdf-input').value = '';
    } catch (err) {
      console.error('❌ Upload error:', err);
      setMessage(err.message || '❌ Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  if (authLoading) return <Loading />;

  return (
    <div className="upload-note-container">
      <h2>Upload New Note (PDF)</h2>
      <form onSubmit={handleUpload} className="upload-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="file"
          accept="application/pdf"
          id="pdf-input"
          onChange={(e) => setPdfFile(e.target.files[0])}
          required
        />
        <button type="submit" disabled={isUploading}>
          {isUploading ? <Loading /> : 'Upload Note'}
        </button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

export default UploadNote;
