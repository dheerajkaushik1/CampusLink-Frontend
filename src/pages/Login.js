import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'

function Login() {
    const [credentials, setCredentials] = useState({email: '', password: ''})
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('https://campuslink-4xaw.onrender.com/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        const json = await response.json();

        if(response.ok){
            localStorage.setItem('token', json.token);
            navigate('/notes');
        } else {
            alert(json.msg || 'Something went wrong');
        }
    };

    return (
        <div className='login-container'>
            <h2>Login To CampusLink</h2>
            <form className='login-form' onSubmit={handleSubmit}>
                <input
                    type="email"
                    name='email'
                    placeholder='Enter Email'
                    value={credentials.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name='password'
                    placeholder='Enter Password'
                    value={credentials.password}
                    onChange={handleChange}
                    required
                />
                <button type='submit'>Login</button>
            </form>
        </div>
    )
}

export default Login
