import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import './Navbar.css';

function Navbar() {
    const navgiate = useNavigate();
    const isLoggedIn = localStorage.getItem('token')

    const handleLogout = () => {
        localStorage.removeItem('token')
        navgiate('/login')
    }

  return (
   <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/notes">CampusLink</Link>
      </div>

      <div className="navbar-auth">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="btn">Login</Link>
            <Link to="/signup" className="btn">Signup</Link>
          </>
        ) : (
          <button className="btn logout" onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  )
};

export default Navbar;
