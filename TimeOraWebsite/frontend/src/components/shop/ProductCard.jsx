import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi';
import { CartContext } from '../../context/CartContext.jsx';
import { WishlistContext } from '../../context/WishlistContext.jsx';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  const isWishlisted = isInWishlist(product._id);

  const handleAddCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Default to first variant if exists, or none
    const color = product.variants?.[0]?.color || '';
    const strap = product.variants?.[0]?.strapMaterial || '';
    addToCart(product, 1, color, strap);
    toast.success(`${product.name} added to cart.`);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative bg-[#121212]/40 border border-white/5 hover:border-luxury-gold/30 rounded-lg overflow-hidden transition-all duration-500 shadow-luxury-soft hover:shadow-gold-glow flex flex-col h-full">
      
      {/* Product Image Panel */}
      <div className="relative aspect-[4/5] bg-[#161616] overflow-hidden">
        <Link to={`/products/${product.slug}`}>
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Labels Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isLimitedEdition && (
            <span className="bg-luxury-gold text-luxury-black text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-sm shadow-md">
              Limited
            </span>
          )}
          {product.discountPrice && (
            <span className="bg-white text-luxury-black text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-sm shadow-md">
              Sale
            </span>
          )}
        </div>

        {/* Action button overlay on hover */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <button
            onClick={handleWishlistClick}
            className={`w-9 h-9 rounded-full flex items-center justify-center border shadow-md transition-all duration-200 ${
              isWishlisted
                ? 'bg-luxury-gold border-luxury-gold text-luxury-black'
                : 'bg-luxury-black/60 border-white/10 text-white hover:text-luxury-gold hover:bg-luxury-black'
            }`}
            aria-label="Add to Wishlist"
          >
            <FiHeart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Bottom Quick-Add Bar */}
        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddCartClick}
            disabled={product.stock <= 0}
            className="w-full bg-luxury-black/90 border border-white/10 hover:border-luxury-gold/50 text-white hover:text-luxury-gold text-xs font-semibold uppercase tracking-wider py-2.5 rounded backdrop-blur flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50"
          >
            <FiShoppingBag size={14} />
            {product.stock <= 0 ? 'Out of Stock' : 'Quick Add'}
          </button>
        </div>
      </div>

      {/* Info Details Section */}
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-medium mb-1">
          {product.category?.name || 'Watch'}
        </span>
        
        <Link 
          to={`/products/${product.slug}`}
          className="font-playfair text-white text-base hover:text-luxury-gold transition-colors duration-200 mb-2 line-clamp-1 leading-snug"
        >
          {product.name}
        </Link>

        {/* Rating Stars */}
        <div className="flex items-center space-x-1 mb-3 text-xs">
          <div className="flex text-luxury-gold">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                size={12}
                fill={i < Math.round(product.ratings || 0) ? 'currentColor' : 'none'}
                className="stroke-1"
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-500">({product.numReviews || 0})</span>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline space-x-2 mt-auto font-poppins">
          {product.discountPrice ? (
            <>
              <span className="text-sm font-semibold text-luxury-gold">
                PKR {product.discountPrice.toLocaleString()}
              </span>
              <span className="text-xs text-gray-600 line-through">
                PKR {product.price.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-sm font-semibold text-white">
              PKR {product.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default ProductCard;
