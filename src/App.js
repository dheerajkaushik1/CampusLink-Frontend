import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Notes from './components/Notes';
import Notices from './components/Notices';
import UploadNotice from './components/UploadNotice';
import Chat from './pages/Chat';
import UploadNote from './components/UploadNote';
import Home from './pages/Home';
import DoubtList from './components/DoubtList';
import AskDoubt from './pages/AskDoubt';
import DoubtDetail from './pages/DoubtDetail';

function App() {
  return (
    <>
      <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/notes' element={<Notes />} key='notes' />
        <Route path='/notices' element={<Notices />} key='notes' />
        <Route path='/upload-notice' element={<UploadNotice />} key='notes' />
        <Route path='/chat' element={<Chat />} key='notes' />
        <Route path="/uploadnote" element={<UploadNote />} />
        <Route path='/' element={<Home />} />
        <Route path="/doubts" element={<DoubtList />} />
        <Route path="/ask-doubt" element={<AskDoubt />} />
        <Route path="/doubts/:id" element={<DoubtDetail />} />
      </Routes>
      <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
