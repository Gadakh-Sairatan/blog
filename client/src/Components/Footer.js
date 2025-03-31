import React from "react";
import { useLocation } from "react-router-dom";
import { FaFacebook, FaInstagram, FaXTwitter, FaGithub } from "react-icons/fa6"; // Social icons
import "../styles/styles.css";

const Footer = () => {
  const location = useLocation();

  // Footer will be visible only on the homepage ("/")
  if (location.pathname !== "/") {
    return null;
  }

  return (
    <footer className="footer">
      <p className="footer-tagline">
        Making the world a better place through constructing fanstastic Blogs.
      </p>
      <div className="footer-social">
        <FaFacebook />
        <FaInstagram />
        <FaXTwitter />
        <FaGithub />
      </div>

      <div className="footer-sections">
        <div className="footer-column">
          <h4>Support</h4>
          <p>Documentation</p>
          <p>Guides</p>
        </div>

        <div className="footer-column">
          <h4>Company</h4>
          <p>About</p>
          <p>Blog</p>
        </div>

        <div className="footer-column">
          <h4>Legal</h4>
          <p>Terms of service</p>
          <p>Privacy policy</p>
          <p>License</p>
        </div>
      </div>

      <hr className="footer-line" />
      <p className="footer-copyright">© 2025 SaiRatan Gadakh, Inc. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
