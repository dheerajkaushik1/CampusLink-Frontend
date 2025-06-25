import React, { useState } from 'react';
import './UploadNote.css';

function UploadNote() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [message, setMessage] = useState('');

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
      const res = await fetch('https://campuslink-4xaw.onrender.com/api/notes/uploadnotes', {
        method: 'POST',
        body: formData,
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

      const result = await res.json();
      setMessage('✅ Note uploaded successfully!');
      setTitle('');
      setDescription('');
      setPdfFile(null);
    } catch (err) {
      console.error('❌ Upload error:', err);
      setMessage(err.message || '❌ Upload failed');
    }
  };

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
          onChange={(e) => setPdfFile(e.target.files[0])}
          required
        />
        <button type="submit">Upload Note</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

export default UploadNote;
