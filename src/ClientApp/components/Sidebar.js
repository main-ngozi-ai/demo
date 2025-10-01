import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SiteLogo from './Img/site-logo.png';

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  // React Router navigate hook
  const navigate = useNavigate();

  // Track which link is active
  const [activeLink, setActiveLink] = useState('/');

  // Track if the "Agents" sub-menu is expanded
  const [agentsExpanded, setAgentsExpanded] = useState(false);

  useEffect(() => {
    const storedActiveLink = localStorage.getItem('activeLink');
    if (storedActiveLink) {
      // 1) Set the activeLink state
      setActiveLink(storedActiveLink);
      // 2) Programmatically navigate to that route on load
     // navigate(storedActiveLink);
    }
  }, [navigate]);

  // Expand "Agents" submenu automatically if the user’s stored link is one of the sub-links
  useEffect(() => {
    if (
      activeLink === '/social-accounts' ||
      activeLink === '/agents' ||
      activeLink === '/errandbots' ||
      activeLink === '/add-transcribe'
    ) {
      setAgentsExpanded(true);
    }
  }, [activeLink]);

  const handleLinkClick = (link) => {
    setActiveLink(link);
    localStorage.setItem('activeLink', link);
    toggleSidebar();
  };

  const toggleAgentsSubmenu = () => {
    setAgentsExpanded(!agentsExpanded);
  };

  return (
    <aside className={`main-sidebar col-12 col-md-3 col-lg-2 px-0 ${sidebarOpen ? 'open' : ''}`}>
      <div className="main-navbarr">
        <nav className="navbar">
          <Link to="/" style={{ lineHeight: '25px' }}>
            <div className="main-logo">
              <img
                id="main-logo"
                style={{ maxWidth: '40px' }}
                src={SiteLogo}
                alt="Site Logo"
              />
            </div>
          </Link>
          <a
            className="toggle-sidebar d-sm-inline d-md-none d-lg-none"
            onClick={toggleSidebar}
          >
            <i className="material-icons">&#xE5C4;</i>
          </a>
        </nav>
      </div>

      <div className="nav-wrapper">
        <ul className="nav flex-column">

          {/* DASHBOARD */}
          <li className="nav-item">
            <Link
              className={`nav-link ${
                (activeLink === '/dashboard' || activeLink === '/') ? 'active' : ''
              }`}
              to="/dashboard"
              onClick={() => handleLinkClick('/')}
            >
              <i className="material-icons">insert_chart</i>
              <span>Dashboard</span>
            </Link>
          </li>

          {/* AGENTS (PARENT) */}
          <li className="nav-item">
            <div
              className={`nav-link ${
                (activeLink === '/social-accounts' ||
                 activeLink === '/agents' ||
                 activeLink === '/errandbots' ||
                 activeLink === '/add-transcribe')
                   ? 'active'
                   : ''
              }`}
              onClick={toggleAgentsSubmenu}
              style={{ cursor: 'pointer' }}
            >
              <i className="material-icons">supervisor_account</i>
              <span>Agents</span>
            </div>

            {/* Sub-menu */}
            {agentsExpanded && (
              <ul className="nav flex-column" style={{ marginLeft: '20px' }}>
                {/* ACCOUNTS */}
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      activeLink === '/socialAccounts' ? 'active' : ''
                    }`}
                    to="/socialAccounts"
                    onClick={() => handleLinkClick('/socialAccounts')}
                  >
                    <i className="material-icons">nature_people</i>
                    <span>Add</span>
                  </Link>
                </li>
                {/* KNOWLEDGE SOURCE */}
                <li className="nav-item">
                  <Link
                    className={`nav-link ${activeLink === '/addTranscribe' ? 'active' : ''}`}
                    to="/addTranscribe"
                    onClick={() => handleLinkClick('/addTranscribe')}
                  >
                    <i className="material-icons">storage</i>
                    <span>Knowledge</span>
                  </Link>
                </li>
                {/* CONTROL PANEL */}
                <li className="nav-item">
                  <Link
                    className={`nav-link ${activeLink === '/controlPanel' ? 'active' : ''}`}
                    to="/controlPanel"
                    onClick={() => handleLinkClick('/controlPanel')}
                  >
                    <i className="material-icons">build</i>
                    <span>Controls</span>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className={`nav-link ${activeLink === '/agents' ? 'active' : ''}`}
                    to="/agents"
                    onClick={() => handleLinkClick('/agents')}
                  >
                    <i className="material-icons">people</i>
                    <span>View</span>
                  </Link>
                </li>

                {/* PRODUCT */}
                <li className="nav-item">
                  <Link
                    className={`nav-link ${activeLink === '/errandbots' ? 'active' : ''}`}
                    to="/errandbots"
                    onClick={() => handleLinkClick('/errandbots')}
                  >
                    <i className="material-icons">group_work</i>
                    <span>Products</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* EDIT PROFILE */}
          <li className="nav-item">
            <Link
              className={`nav-link ${activeLink === '/user-profile' ? 'active' : ''}`}
              to="/user-profile"
              onClick={() => handleLinkClick('/user-profile')}
            >
              <i className="material-icons">person</i>
              <span>Edit Profile</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
