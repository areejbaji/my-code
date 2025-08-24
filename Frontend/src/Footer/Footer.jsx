import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { MdContactPage } from "react-icons/md";
import './Footer.css'; // Update path if needed

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Us Section */}
        <div className="footer-about">
          <h2 className="footer-title">StyleHub</h2>
          <p className="footer-description">
            StyleHub is your go-to place for trendy and comfortable fashion. We help you find the perfect fit using your custom body measurements, so you always look and feel your best.
          </p>
        </div>

        {/* Quick Links Section */}
        <div className="footer-quick-links">
          <h3 className="footer-subtitle">QUICK LINKS</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/mens">Mens</a></li>
            <li><a href="/Womens">Women</a></li>
            <li><a href="/AboutUs">About Us</a></li>
          </ul>
        </div>

        {/* Support Section */}
        <div className="footer-support">
          <h3 className="footer-subtitle">SUPPORT</h3>
          <ul>
            <li>
              <a href="/contactus">
                <MdContactPage style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Contact Us
              </a>
            </li>
            
            <li><a href="/Faq">FAQS</a></li>
            <li><a href="/termsandcondition">Terms and condition</a></li>
            <li><a href="/shippingpolicy">Shipping Policy</a></li>
          </ul>
        </div>

        {/* Follow Us Section */}
        <div className="footer-social">
          <h3 className="footer-subtitle">FOLLOW US</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} StyleHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;