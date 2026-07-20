import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiSearch, FiHeart, FiShoppingBag, FiUser, 
  FiMenu, FiX, FiChevronDown, FiLogOut, FiLayout 
} from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext.jsx';
import { CartContext } from '../../context/CartContext.jsx';
import { WishlistContext } from '../../context/WishlistContext.jsx';
import API from '../../services/api.js';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionsDropdownOpen, setCollectionsDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);

  // Fetch categories for the Mega Menu
  useEffect(() => {
    API.get('/categories')
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  // Close menus on path transition
  useEffect(() => {
    setMobileMenuOpen(false);
    setCollectionsDropdownOpen(false);
    setProfileDropdownOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full glass-nav transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-black font-playfair tracking-widest text-white flex items-center">
                TICKORA<span className="text-luxury-gold text-3xl font-poppins leading-none">.</span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex space-x-8 items-center">
              <Link 
                to="/" 
                className={`text-sm tracking-wider uppercase hover:text-luxury-gold transition-colors duration-200 ${
                  location.pathname === '/' ? 'text-luxury-gold' : 'text-gray-300'
                }`}
              >
                Home
              </Link>

              <Link 
                to="/shop" 
                className={`text-sm tracking-wider uppercase hover:text-luxury-gold transition-colors duration-200 ${
                  location.pathname === '/shop' ? 'text-luxury-gold' : 'text-gray-300'
                }`}
              >
                Shop
              </Link>

              {/* Collections Mega Menu Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setCollectionsDropdownOpen(true)}
                onMouseLeave={() => setCollectionsDropdownOpen(false)}
              >
                <button 
                  className={`flex items-center space-x-1 text-sm tracking-wider uppercase hover:text-luxury-gold transition-colors duration-200 focus:outline-none ${
                    location.pathname.startsWith('/collections') ? 'text-luxury-gold' : 'text-gray-300'
                  }`}
                >
                  <span>Collections</span>
                  <FiChevronDown className={`transition-transform duration-200 ${collectionsDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Mega Menu panel */}
                {collectionsDropdownOpen && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-[600px] bg-luxury-black/95 border border-white/5 shadow-luxury-soft rounded-lg p-6 grid grid-cols-2 gap-6 z-50 backdrop-blur-lg">
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <Link 
                          key={cat._id}
                          to={`/shop?category=${cat.slug}`}
                          className="group flex space-x-4 p-2 rounded-md hover:bg-white/5 transition-colors duration-200"
                        >
                          <img 
                            src={cat.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=150'} 
                            alt={cat.name} 
                            className="w-16 h-16 object-cover rounded border border-white/10 group-hover:border-luxury-gold/30 transition-all duration-300"
                          />
                          <div>
                            <h4 className="font-playfair text-white text-base group-hover:text-luxury-gold transition-colors duration-200">{cat.name}</h4>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{cat.description}</p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm col-span-2 text-center py-4">No collections loaded</p>
                    )}
                  </div>
                )}
              </div>

              <Link 
                to="/about" 
                className={`text-sm tracking-wider uppercase hover:text-luxury-gold transition-colors duration-200 ${
                  location.pathname === '/about' ? 'text-luxury-gold' : 'text-gray-300'
                }`}
              >
                About
              </Link>
              
              <Link 
                to="/contact" 
                className={`text-sm tracking-wider uppercase hover:text-luxury-gold transition-colors duration-200 ${
                  location.pathname === '/contact' ? 'text-luxury-gold' : 'text-gray-300'
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-6">
              
              {/* Search Trigger */}
              <button 
                onClick={() => setSearchOpen(true)}
                className="text-gray-300 hover:text-luxury-gold transition-colors duration-200 focus:outline-none"
                aria-label="Search"
              >
                <FiSearch size={20} />
              </button>

              {/* Wishlist */}
              <Link 
                to="/wishlist" 
                className="relative text-gray-300 hover:text-luxury-gold transition-colors duration-200"
                aria-label="Wishlist"
              >
                <FiHeart size={20} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-luxury-gold text-luxury-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link 
                to="/cart" 
                className="relative text-gray-300 hover:text-luxury-gold transition-colors duration-200"
                aria-label="Shopping Cart"
              >
                <FiShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-luxury-gold text-luxury-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setProfileDropdownOpen(true)}
                onMouseLeave={() => setProfileDropdownOpen(false)}
              >
                {user ? (
                  <button className="flex items-center space-x-1 text-gray-300 hover:text-luxury-gold focus:outline-none transition-colors duration-200">
                    <FiUser size={20} />
                    <span className="hidden lg:inline text-xs max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                    <FiChevronDown size={14} />
                  </button>
                ) : (
                  <Link 
                    to="/login" 
                    className="text-gray-300 hover:text-luxury-gold transition-colors duration-200"
                    aria-label="Login Account"
                  >
                    <FiUser size={20} />
                  </Link>
                )}

                {/* Profile menu dropdown */}
                {user && profileDropdownOpen && (
                  <div className="absolute right-0 w-48 bg-luxury-black border border-white/5 shadow-luxury-soft rounded-md py-2 z-50 backdrop-blur-lg">
                    {isAdmin ? (
                      <Link 
                        to="/admin" 
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-luxury-gold transition-colors duration-150"
                      >
                        <FiLayout size={16} />
                        <span>Admin Panel</span>
                      </Link>
                    ) : (
                      <Link 
                        to="/profile" 
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-luxury-gold transition-colors duration-150"
                      >
                        <FiUser size={16} />
                        <span>My Account</span>
                      </Link>
                    )}
                    
                    <button 
                      onClick={logout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-luxury-gold text-left transition-colors duration-150 focus:outline-none"
                    >
                      <FiLogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Hamburger Toggle */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-300 hover:text-luxury-gold transition-colors duration-200 focus:outline-none"
                aria-label="Toggle Mobile Menu"
              >
                {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* Slide-out Search Modal Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-luxury-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <button 
            onClick={() => setSearchOpen(false)}
            className="absolute top-8 right-8 text-white hover:text-luxury-gold transition-colors duration-200 focus:outline-none"
          >
            <FiX size={32} />
          </button>
          
          <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl text-center">
            <h3 className="font-playfair text-2xl sm:text-3xl text-white mb-6 uppercase tracking-wider">Search the Tickora Collection</h3>
            <div className="relative border-b-2 border-white/20 focus-within:border-luxury-gold transition-all duration-300">
              <input 
                type="text" 
                placeholder="Search by model, movement, color..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent text-white text-xl py-4 pr-10 focus:outline-none placeholder-white/30 text-center font-playfair tracking-wide"
              />
              <button type="submit" className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white hover:text-luxury-gold transition-colors duration-200 focus:outline-none">
                <FiSearch size={24} />
              </button>
            </div>
            <div className="mt-8 text-left max-w-md mx-auto">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {['Automatic', 'Skeleton', 'Quartz', 'Chronograph', 'Limited Edition'].map((item) => (
                  <button 
                    key={item} 
                    type="button"
                    onClick={() => {
                      setSearchQuery(item);
                    }}
                    className="text-xs bg-white/5 border border-white/10 hover:border-luxury-gold/50 text-gray-300 hover:text-luxury-gold px-3 py-1.5 rounded transition-all duration-200"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-luxury-black/98 md:hidden flex flex-col pt-24 px-6">
          <nav className="flex flex-col space-y-6 text-center">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-playfair uppercase text-white hover:text-luxury-gold transition-colors duration-200"
            >
              Home
            </Link>
            
            <Link 
              to="/shop" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-playfair uppercase text-white hover:text-luxury-gold transition-colors duration-200"
            >
              Shop All
            </Link>

            <div className="border-t border-white/5 py-4">
              <p className="text-xs uppercase tracking-widest text-luxury-gold mb-4">Collections</p>
              <div className="grid grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <Link 
                    key={cat._id}
                    to={`/shop?category=${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-gray-300 hover:text-white uppercase tracking-wider"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link 
              to="/about" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-playfair uppercase text-white hover:text-luxury-gold transition-colors duration-200"
            >
              About
            </Link>
            
            <Link 
              to="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-playfair uppercase text-white hover:text-luxury-gold transition-colors duration-200"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
