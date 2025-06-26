import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import Loading from '../components/Loading';

function Signup() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    year: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://campuslink-4xaw.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const json = await response.json();

      if (response.ok) {
        localStorage.setItem('token', json.token);
        localStorage.setItem('year', credentials.year);
        navigate('/notes');
      } else {
        alert(json.msg || 'Something went wrong');
      }
    } catch (err) {
      console.error('❌ Signup failed:', err);
      alert('❌ Signup failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="signup-container">
      <h2>Create Your CampusLink Account</h2>
      <form onSubmit={handleSubmit} className='signup-form'>
        <input
          type="text"
          name='name'
          placeholder='Enter Name'
          value={credentials.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name='email'
          placeholder='Enter Email'
          value={credentials.email}
          onChange={handleChange}
          required
          autoComplete='off'
        />
        <input
          type="password"
          name='password'
          placeholder='Enter Password'
          value={credentials.password}
          onChange={handleChange}
          required
          autoComplete='off'
        />
        <select
          name="year"
          value={credentials.year}
          onChange={handleChange}
          required
        >
          <option value="">Select Year</option>
          <option value="1st">1st Year</option>
          <option value="2nd">2nd Year</option>
          <option value="3rd">3rd Year</option>
          <option value="4th">4th Year</option>
        </select>

        <button type='submit'>Signup</button>
      </form>
    </div>
  );
}

export default Signup;
