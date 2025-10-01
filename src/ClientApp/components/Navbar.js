import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../../core/api/auth';
import defaultAvatar from '../../assets/default-avatar.png'; 

const Navbar = ({ toggleSidebar }) => {
  const rawUrl = localStorage.getItem('photoURL') || '';
  const displayName = localStorage.getItem('displayName') || '';

  let photo = rawUrl.match(/=s\d+-c$/)
  ? rawUrl.replace(/=s\d+-c$/, '?sz=96')
  : rawUrl;

  const avatarSrc = (photo && photo.startsWith('http'))
  ? photo 
  : defaultAvatar;

  const [notifications] = useState([
    {
      category: 'Analytics',
      message:
        "Your website’s active users count increased by <span class='text-success text-semibold'>28%</span> in the last week. Great job!",
      icon: '&#xE6E1;',
    },
    {
      category: 'Sales',
      message:
        "Last week your store’s sales count decreased by <span class='text-danger text-semibold'>5.52%</span>. It could have been worse!",
      icon: '&#xE8D1;',
    },
  ]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen((o) => !o);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="main-navbar sticky-top">
      <nav className="navbar align-items-center navbar-light flex-md-nowrap p-0">
        <form className="main-navbar__search w-100 d-none d-md-flex d-lg-flex" />

        <div className="d-flex align-items-center ml-auto">
          <img
            className="user-avatar rounded-circle mr-2"
            src={avatarSrc}
            alt="User Avatar"
            width={32}
            height={32}
          />
          <div
            className="d-none d-md-inline-block text-truncate"
            style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden' }}
            title={displayName}
          >
            {displayName}
          </div>

          <div className="nav-item dropdown notifications" ref={dropdownRef}>
            <Link
              className="nav-link nav-link-icon text-center"
              to="#"
              role="button"
              onClick={toggleDropdown}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <div className="nav-link-icon__wrapper">
                <i className="material-icons">&#xE7F4;</i>
                <span className="badge badge-pill badge-danger">
                  {notifications.length}
                </span>
              </div>
            </Link>

            {dropdownOpen && (
              <div className="dropdown-menu dropdown-menu-small show">
                {notifications.map((n, i) => (
                  <Link className="dropdown-item" to="#" key={i}>
                    <div className="notification__icon-wrapper">
                      <div className="notification__icon">
                        <i
                          className="material-icons"
                          dangerouslySetInnerHTML={{ __html: n.icon }}
                        />
                      </div>
                    </div>
                    <div className="notification__content">
                      <span className="notification__category">{n.category}</span>
                      <p dangerouslySetInnerHTML={{ __html: n.message }} />
                    </div>
                  </Link>
                ))}
                <Link className="dropdown-item notification__all text-center" to="#">
                  View all Notifications
                </Link>
              </div>
            )}
          </div>

          <div className="nav-item">
            <button
              className="nav-link nav-link-icon btn btn-link text-center"
              onClick={logout}
            >
              <i className="material-icons">exit_to_app</i>
            </button>
          </div>

          <nav className="nav Pg_Togller">
            <Link
              to="#"
              className="nav-link nav-link-icon toggle-sidebar d-md-inline d-lg-none text-center"
              role="button"
              onClick={toggleSidebar}
            >
              <i className="material-icons">&#xE5D2;</i>
            </Link>
          </nav>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
