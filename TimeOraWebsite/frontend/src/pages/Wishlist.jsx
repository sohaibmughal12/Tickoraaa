import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiHeart } from 'react-icons/fi';
import { WishlistContext } from '../context/WishlistContext.jsx';
import { CartContext } from '../context/CartContext.jsx';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const handleMoveToCart = (product) => {
    // Default variations if exists
    addToCart(product, 1, '', '');
    removeFromWishlist(product._id);
    toast.success(`${product.name} moved to cart.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
      {/* Header */}
      <div className="text-center space-y-3 mb-12">
        <h1 className="text-3xl sm:text-5xl font-playfair uppercase tracking-wider text-white">My Wishlist</h1>
        <p className="text-xs uppercase tracking-widest text-luxury-gold">Your curated luxury collection</p>
        <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-2" />
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlistItems.map((item) => (
            <div 
              key={item._id} 
              className="group bg-[#121212]/40 border border-white/5 hover:border-luxury-gold/30 rounded-lg overflow-hidden transition-all duration-300 shadow-luxury-soft"
            >
              {/* Image */}
              <div className="relative aspect-square bg-[#161616] overflow-hidden">
                <Link to={`/products/${item.sku}`}>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <button
                  onClick={() => removeFromWishlist(item._id)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-luxury-black/70 hover:bg-red-900 border border-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Remove item"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>

              {/* Details */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-playfair text-lg text-white group-hover:text-luxury-gold transition-colors duration-200 line-clamp-1">
                    {item.name}
                  </h3>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-light">SKU: {item.sku}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-luxury-gold font-poppins">
                    PKR {item.discountPrice ? item.discountPrice.toLocaleString() : item.price.toLocaleString()}
                  </span>
                  
                  <button
                    onClick={() => handleMoveToCart(item)}
                    disabled={item.stock <= 0}
                    className="btn-outline-gold px-4 py-2 text-[10px] tracking-widest font-semibold flex items-center space-x-1"
                  >
                    <FiShoppingBag size={12} />
                    <span>{item.stock <= 0 ? 'Out of Stock' : 'Move to Cart'}</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#121212]/10 border border-white/5 rounded-lg max-w-md mx-auto">
          <FiHeart size={48} className="text-gray-600 mx-auto mb-4 stroke-1" />
          <h3 className="font-playfair text-xl text-white mb-2">Your wishlist is empty</h3>
          <p className="text-xs text-gray-500 font-light leading-relaxed mb-6">
            Explore the Tickora collections and click the heart icon to save timepieces for later.
          </p>
          <Link to="/shop" className="btn-gold text-xs">Explore Shop</Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
