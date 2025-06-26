import React from 'react'
import { useState } from 'react';
import './Footer.css';
import { Link, useNavigate } from 'react-router-dom';

function Footer() {
  const Navigate = useNavigate();
    const [activeItem, setActiveItem] = useState('Notes')
    
    const handleClick = (item) => {
        setActiveItem(item)
        Navigate(`/${item}`)
    }

  return (
    <div className="foot-item-container">
        <div className={`foot-item ${activeItem === 'notes' ? 'active' : ''}`} onClick={() => {handleClick('notes')}}><Link to='/notes'>📄 Notes</Link></div>
        <div className={`foot-item ${activeItem === 'notices' ? 'active' : ''}`} onClick={() => {handleClick('notices')}}><Link to='/notices'>📢 Notices</Link></div>
        <div className={`foot-item ${activeItem === 'doubt' ? 'active' : ''}`} onClick={() => {handleClick('doubts')}}>❓ Doubts</div>
        <div className={`foot-item ${activeItem === 'chat' ? 'active' : ''}`} onClick={() => {handleClick('chat')}}><Link to='/chat' onClick={() => {handleClick('chat')}}>💬 Chat</Link></div>
    </div>
  )
}

export default Footer
