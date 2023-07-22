import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import logo from './sparmepic.png';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const showNavigation = sessionUser || !isLoaded;
  const [isMenuOpen, setMenuOpen] = useState(false);

  if (!showNavigation) {
    return null;
  }

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const menuClass = `navigation-list ${isMenuOpen ? "open" : ""}`;

  return (
    <nav className="navigation">
      <div className="navigation-container">
        <img src={logo} alt="Website logo" className="logo"/>
        <button onClick={toggleMenu} className="hamburger">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </button>
        <ul className={menuClass}>
          {isLoaded && sessionUser && (
            <li className="navigation-item">
              <NavLink to="/user/dashboard" className="navigation-link">Home</NavLink>
            </li>
          )}
		  {isLoaded && sessionUser && (
            <li className="navigation-item">
              <NavLink to="/sessions" className="navigation-link">Sparring</NavLink>
            </li>
          )}
		  {isLoaded && sessionUser && (
            <li className="navigation-item">
              <NavLink to="/gyms" className="navigation-link">Gyms</NavLink>
            </li>
          )}
		  {isLoaded && sessionUser && (
            <li className="navigation-item">
              <NavLink to="/messages" className="navigation-link">Messages</NavLink>
            </li>
          )}
		  {isLoaded && sessionUser && (
            <li className="navigation-item">
              <NavLink to="/reviews" className="navigation-link">Reviews</NavLink>
            </li>
          )}
        </ul>
        {isLoaded && <ProfileButton user={sessionUser} />}
      </div>
    </nav>
  );
}

export default Navigation;
