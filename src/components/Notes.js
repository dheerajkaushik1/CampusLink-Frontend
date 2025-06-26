import React, { useEffect, useState, useRef } from 'react';
import './Notes.css';
import Loading from '../components/Loading';
import { useNavigate } from 'react-router-dom';

function Notes() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editNoteId, setEditNoteId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDesc, setEditedDesc] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const confirmShownRef = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      if (!confirmShownRef.current) {
        confirmShownRef.current = true;
        navigate('/login');
      }
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch('https://campuslink-4xaw.onrender.com/api/auth/getuser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token,
          },
        });

        if (!res.ok) throw new Error('Unauthorized');
        const data = await res.json();
        setIsAdmin(data.isAdmin);
      } catch (err) {
        console.error('❌ Failed to fetch user:', err);
      }
    };

    fetchUser();
    fetchNotes();
  }, [navigate]);

  const fetchNotes = async () => {
    try {
      const res = await fetch('https://campuslink-4xaw.onrender.com/api/notes/getnotes');
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();

      const processed = data.map((n) => {
        const uintArray = new Uint8Array(n.pdf.data.data);
        const blob = new Blob([uintArray], { type: n.pdf.contentType });
        const url = URL.createObjectURL(blob);
        return { ...n, blobUrl: url };
      });

      setNotes(processed);
    } catch (err) {
      console.error('❌ Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`https://campuslink-4xaw.onrender.com/api/notes/deletenote/${id}`, {
        method: 'DELETE',
        headers: {
          'auth-token': token,
        },
      });
      if (!res.ok) throw new Error('Delete failed');
      setNotes(notes.filter((n) => n._id !== id));
    } catch (err) {
      console.error('❌ Delete failed:', err);
    }
  };

  const handleEdit = (note) => {
    setEditNoteId(note._id);
    setEditedTitle(note.title);
    setEditedDesc(note.description);
  };

  const saveEdit = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`https://campuslink-4xaw.onrender.com/api/notes/editnote/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
        body: JSON.stringify({ title: editedTitle, description: editedDesc }),
      });

      if (!res.ok) throw new Error('Edit failed');
      setNotes(notes.map((n) => (n._id === id ? { ...n, title: editedTitle, description: editedDesc } : n)));
      setEditNoteId(null);
    } catch (err) {
      console.error('❌ Edit failed:', err);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="page-wrapper">
      <div className="notes-container">
        <div className="notes-header">
          <h2 className="notes-title">Available Notes</h2>
          {isAdmin && (
            <button className="upload-note-button" onClick={() => navigate('/uploadnote')}>
              Upload Note
            </button>
          )}
        </div>

        {notes.length === 0 ? (
          <p>No notes found.</p>
        ) : (
          <ul className="notes-list">
            {notes.map((note) => (
              <li key={note._id} className="note-item">
                {editNoteId === note._id ? (
                  <>
                    <input
                      className="note-input"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                    />
                    <textarea
                      className="note-input"
                      value={editedDesc}
                      onChange={(e) => setEditedDesc(e.target.value)}
                    />
                    <button onClick={() => saveEdit(note._id)} className="note-btn save">
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href={note.blobUrl}
                      download={note.pdf.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="note-link"
                    >
                      {note.title || note.pdf.name}
                    </a>
                    {isAdmin && (
                      <div className="note-actions">
                        <button onClick={() => handleEdit(note)} className="note-btn edit">
                          ✏️
                        </button>
                        <button onClick={() => handleDelete(note._id)} className="note-btn delete">
                          🗑️
                        </button>
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Notes;
