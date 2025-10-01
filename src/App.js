import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

import './imported-style.css';
import './main-style.css';
import './App.css';

import Sidebar from '../src/ClientApp/components/Sidebar';
import Navbar from '../src/ClientApp/components/Navbar';
import Footer from '../src/ClientApp/components/Footer';

import HomePage from '../src/ClientApp/pages/userHome/HomePage';
import AddTranscribeSourceContainer from './ClientApp/pages/userHome/AddBusiness/AddTranscribeSourceContainer';
import TranscribedContainer from './ClientApp/pages/userHome/Transcribed/TranscribedContainer';
import ErrandBotContainer from './ClientApp/pages/userHome/errandBot/ErrandBotContainer';
import AgentsContainer from './ClientApp/pages/userHome/agents/AgentsContainer';
import ControlPanelContainer from './ClientApp/pages/userHome/controlPanel/ControlPanelContainer';
import UserProfilePage from '../src/ClientApp/pages/userHome/UserProfilePage';
import BlogPostPage from '../src/ClientApp/pages/userHome/BlogPostPage';
import SocialAccountContainer from './ClientApp/pages/userHome/socialAccounts/SocialAccountContainer';
import LoginContainer from '../src/ClientApp/pages/login/LoginContainer';

import ProtectedRoute from './core/routes/protectedRoute';
function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, this page does not exist.</p>
    </div>
  );
}

function ProtectedLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row">
          <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <main className="main-content col-lg-10 col-md-9 col-sm-12 p-0 offset-lg-2 offset-md-3">
            <Navbar toggleSidebar={toggleSidebar} />
            <Outlet />
            <Footer />
          </main>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginContainer />} />
        <Route path="/login" element={<LoginContainer />} />
        <Route path="/signup" element={<LoginContainer />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<HomePage />} />
            <Route path="/addTranscribe" element={<AddTranscribeSourceContainer />} />
            <Route path="/transcribed/:id" element={<TranscribedContainer />} />
            <Route path="/errandbots" element={<ErrandBotContainer />} />
            <Route path="/agents" element={<AgentsContainer />} />
            <Route path="/controlPanel" element={<ControlPanelContainer />} />
            <Route path="/user-profile" element={<UserProfilePage />} />
            <Route path="/blog-posts" element={<BlogPostPage />} />
            <Route path="/socialAccounts" element={<SocialAccountContainer />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
