import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to the Tickora newsletter!');
  };

  return (
    <footer className="bg-luxury-black border-t border-white/5 pt-16 pb-8 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Info & Newsletter */}
          <div className="space-y-6">
            <Link to="/" className="text-2xl font-black font-playfair tracking-widest text-white">
              TICKORA<span className="text-luxury-gold text-3xl font-poppins font-normal">.</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed font-light">
              Crafting premium luxury timepieces inspired by heritage, mechanical geometry, and modern minimalist designs. Elevate your presence.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <label htmlFor="footer-email" className="block text-xs uppercase tracking-widest text-white font-medium">Join our private circle</label>
              <div className="flex border border-white/10 rounded overflow-hidden focus-within:border-luxury-gold/50 transition-all duration-300">
                <input 
                  type="email" 
                  id="footer-email"
                  placeholder="Enter email address" 
                  required
                  className="bg-transparent text-white placeholder-gray-600 text-sm px-4 py-2.5 focus:outline-none w-full font-light"
                />
                <button 
                  type="submit" 
                  className="bg-luxury-gold hover:bg-luxury-goldHover text-luxury-black font-semibold text-xs tracking-wider uppercase px-4 transition-all duration-300 flex items-center justify-center"
                  aria-label="Subscribe Newsletter"
                >
                  <FiMail size={16} />
                </button>
              </div>
            </form>
          </div>

          {/* Collections links */}
          <div className="space-y-4">
            <h4 className="text-sm uppercase tracking-widest text-white font-semibold">Collections</h4>
            <ul className="space-y-2.5 text-sm font-light">
              {['Automatic', 'Quartz', 'Smart Hybrid', 'Chronograph'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/shop?category=${item.toLowerCase().replace(/ /g, '-')}`} 
                    className="hover:text-luxury-gold transition-colors duration-200"
                  >
                    {item} Watches
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/shop" className="hover:text-luxury-gold transition-colors duration-200">
                  Shop All Models
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Policies */}
          <div className="space-y-4">
            <h4 className="text-sm uppercase tracking-widest text-white font-semibold">Customer Care</h4>
            <ul className="space-y-2.5 text-sm font-light">
              <li>
                <Link to="/faq" className="hover:text-luxury-gold transition-colors duration-200">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-luxury-gold transition-colors duration-200">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="hover:text-luxury-gold transition-colors duration-200">
                  Return & Exchange
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-luxury-gold transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="hover:text-luxury-gold transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details & Social Media */}
          <div className="space-y-4">
            <h4 className="text-sm uppercase tracking-widest text-white font-semibold">The House</h4>
            <ul className="space-y-3 text-sm font-light">
              <li className="flex items-start space-x-2">
                <FiMapPin className="text-luxury-gold mt-1 flex-shrink-0" size={16} />
                <span>Gulberg III, Lahore, Punjab, Pakistan</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiPhone className="text-luxury-gold flex-shrink-0" size={16} />
                <span>+92 300 123 4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiMail className="text-luxury-gold flex-shrink-0" size={16} />
                <span>concierge@tickora.com</span>
              </li>
            </ul>
            <div className="pt-4 space-y-2">
              <p className="text-xs uppercase tracking-widest text-white font-medium">Follow Tickora</p>
              <div className="flex space-x-4">
                {[
                  { icon: FiInstagram, path: 'https://instagram.com' },
                  { icon: FiFacebook, path: 'https://facebook.com' },
                  { icon: FiTwitter, path: 'https://twitter.com' },
                  { icon: FiYoutube, path: 'https://youtube.com' }
                ].map((social, idx) => (
                  <a 
                    key={idx}
                    href={social.path}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-luxury-gold transition-colors duration-200"
                    aria-label={`Follow us on Social Channel ${idx + 1}`}
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 font-light">
          <p>&copy; {currentYear} Tickora Luxury. All Rights Reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <span className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              <span>Online Payments Supported (Stripe & Local Pakistani Gateways)</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
