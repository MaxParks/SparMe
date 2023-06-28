import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const showNavigation = sessionUser || !isLoaded;

  if (!showNavigation) {
    return null;
  }

  return (
    <nav className="navigation">
      <div className="navigation-container">
        <ul className="navigation-list">
          {isLoaded && sessionUser && (
            <li className="navigation-item">
              <NavLink to="/user/dashboard" className="navigation-link">Home</NavLink>
            </li>
          )}
		  {isLoaded && sessionUser && (
            <li className="navigation-item">
              <NavLink to="/sessions" className="navigation-link">Sparring Sessions</NavLink>
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
