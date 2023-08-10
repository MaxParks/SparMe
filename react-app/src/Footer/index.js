import React from 'react';
import './Footer.css';
import githubLogo from './2222.png';
import linkedInLogo from './linkedin2.png';
function Footer() {
  return (
    <footer className="footer">
      <div className="social-media-container3">
        <a href="https://github.com/MaxParks/SparMe" target="_blank" rel="noreferrer">
          <img
            className="social-media-logo3"
            src={githubLogo}
            alt="GitHub"
          />
        </a>
        <a href="https://www.linkedin.com/in/maxjparks/" target="_blank" rel="noreferrer">
          <img
            className="social-media-logo4"
            src={linkedInLogo}
            alt="LinkedIn"
          />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
