import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiStar, FiShield, FiCompass, FiTruck, FiShare2 } from 'react-icons/fi';
import API from '../services/api.js';
import { CartContext } from '../context/CartContext.jsx';
import { WishlistContext } from '../context/WishlistContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import ProductCard from '../components/shop/ProductCard.jsx';
import GlassCard from '../components/common/GlassCard.jsx';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { identifier } = useParams();
  const navigate = useNavigate();
  
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Selection states
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedStrap, setSelectedStrap] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' });
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'reviews'

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch product data and details
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const prodRes = await API.get(`/products/${identifier}`);
        const currentProduct = prodRes.data.data;
        setProduct(currentProduct);

        // Pre-select first variant options if exist
        if (currentProduct.variants && currentProduct.variants.length > 0) {
          setSelectedColor(currentProduct.variants[0].color || '');
          setSelectedStrap(currentProduct.variants[0].strapMaterial || '');
        }

        // Fetch related products of the same category
        const relRes = await API.get(`/products?category=${currentProduct.category.slug}&limit=4`);
        setRelatedProducts(relRes.data.data.products.filter(p => p._id !== currentProduct._id));

        // Fetch product reviews
        const revRes = await API.get(`/reviews/product/${currentProduct._id}`);
        setReviews(revRes.data.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
        toast.error('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [identifier]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="w-16 h-16 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400 text-sm font-light">Loading timepiece details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="font-playfair text-3xl text-white mb-4">Timepiece Not Found</h2>
        <p className="text-gray-400 text-sm font-light mb-8">The luxury timepiece you are looking for does not exist or has been removed.</p>
        <Link to="/shop" className="btn-gold">Back to Collection</Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product._id);

  // Zoom implementation on image hover
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${product.images[selectedImage]})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '200%'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  // Add to Cart
  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedStrap);
    toast.success(`${product.name} added to cart.`);
  };

  // Buy Now (Add and Checkout)
  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedStrap);
    navigate('/checkout');
  };

  // Share handler
  const handleShareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out the premium ${product.name} on Tickora!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  // Submit Review Form
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast.error('Please write a review comment.');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await API.post('/reviews', {
        productId: product._id,
        rating: reviewRating,
        comment: reviewComment
      });
      toast.success(res.data.message || 'Review submitted successfully!');
      setReviewComment('');
      setReviewRating(5);
    } catch (error) {
      console.error('Review submit failed:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
      
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 font-light mb-8 space-x-2">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-luxury-gold">{product.name}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Side: Images Gallery */}
        <div className="space-y-4">
          
          {/* Active Image with Zoom Area */}
          <div 
            className="relative aspect-square bg-[#121212] border border-white/5 rounded-lg overflow-hidden cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img 
              src={product.images[selectedImage] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800'} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            {/* Magnifying Zoom Glass Overlay */}
            <div 
              className="absolute inset-0 pointer-events-none bg-no-repeat bg-[#121212]" 
              style={zoomStyle}
            />
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 bg-[#121212] border rounded overflow-hidden transition-all duration-300 ${
                    selectedImage === idx ? 'border-luxury-gold' : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Configuration & Details */}
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-luxury-gold font-semibold font-poppins block mb-1">
              {product.category?.name}
            </span>
            <h1 className="font-playfair text-3xl sm:text-4xl text-white tracking-wide uppercase leading-tight mb-3">
              {product.name}
            </h1>
            
            {/* Star ratings */}
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex text-luxury-gold">
                {[...Array(5)].map((_, i) => (
                  <FiStar 
                    key={i} 
                    size={14} 
                    fill={i < Math.round(product.ratings) ? 'currentColor' : 'none'} 
                    className="stroke-1" 
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 font-light">({reviews.length} customer reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline space-x-3 border-b border-white/5 pb-6">
            {product.discountPrice ? (
              <>
                <span className="text-2xl font-semibold text-luxury-gold">
                  PKR {product.discountPrice.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  PKR {product.price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-2xl font-semibold text-white">
                PKR {product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Description summary */}
          <p className="text-sm text-gray-400 font-light leading-relaxed">
            {product.description}
          </p>

          {/* Configurable Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-4 border-t border-b border-white/5 py-6">
              
              {/* Color list */}
              {Array.from(new Set(product.variants.map(v => v.color).filter(Boolean))).length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Dial Color:</span>
                  <div className="flex gap-2">
                    {Array.from(new Set(product.variants.map(v => v.color).filter(Boolean))).map((col) => (
                      <button
                        key={col}
                        onClick={() => setSelectedColor(col)}
                        className={`text-xs px-4 py-2 border rounded font-light transition-all duration-300 ${
                          selectedColor === col
                            ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/5'
                            : 'border-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Strap material list */}
              {Array.from(new Set(product.variants.map(v => v.strapMaterial).filter(Boolean))).length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Strap Material:</span>
                  <div className="flex gap-2">
                    {Array.from(new Set(product.variants.map(v => v.strapMaterial).filter(Boolean))).map((str) => (
                      <button
                        key={str}
                        onClick={() => setSelectedStrap(str)}
                        className={`text-xs px-4 py-2 border rounded font-light transition-all duration-300 ${
                          selectedStrap === str
                            ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/5'
                            : 'border-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {str}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Add-to-cart & buy controls */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-4">
              
              {/* Quantity Picker */}
              <div className="flex items-center border border-white/10 rounded overflow-hidden h-12 bg-[#121212]">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 text-gray-400 hover:text-white focus:outline-none transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="px-4 text-gray-400 hover:text-white focus:outline-none transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-grow btn-outline-gold h-12 flex items-center justify-center space-x-2 text-xs"
              >
                <FiShoppingBag size={16} />
                <span>Add to Cart</span>
              </button>

              {/* Wishlist toggle */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`w-12 h-12 border rounded flex items-center justify-center transition-all duration-300 ${
                  isWishlisted 
                    ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold' 
                    : 'border-white/10 text-gray-400 hover:border-white hover:text-white'
                }`}
                aria-label="Add to Wishlist"
              >
                <FiHeart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Buy Now button */}
            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="w-full btn-gold h-12 flex items-center justify-center text-xs"
            >
              {product.stock <= 0 ? 'Out of Stock' : 'Buy It Now'}
            </button>
          </div>

          {/* Social Share & Extras */}
          <div className="flex items-center justify-between border-t border-white/5 pt-6 text-xs text-gray-500 font-light">
            <span>SKU: <span className="text-white font-medium">{product.sku}</span></span>
            <button 
              onClick={handleShareProduct} 
              className="flex items-center space-x-1.5 hover:text-luxury-gold transition-colors duration-200"
            >
              <FiShare2 size={14} />
              <span>Share Timepiece</span>
            </button>
          </div>

          {/* Store value markers */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5 text-center text-[10px] uppercase tracking-wider text-gray-400">
            <div className="space-y-1">
              <FiTruck size={20} className="text-luxury-gold mx-auto" />
              <p>Free Nationwide Delivery</p>
            </div>
            <div className="space-y-1">
              <FiShield size={20} className="text-luxury-gold mx-auto" />
              <p>2-Year Internat Warranty</p>
            </div>
            <div className="space-y-1">
              <FiCompass size={20} className="text-luxury-gold mx-auto" />
              <p>Authenticity Checked</p>
            </div>
          </div>

        </div>
      </div>

      {/* TABS (SPECS / REVIEWS) */}
      <section className="mt-24 border-t border-white/5 pt-12">
        <div className="flex space-x-8 border-b border-white/5 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('specs')}
            className={`font-playfair text-xl tracking-wider uppercase focus:outline-none transition-colors duration-200 relative py-2 ${
              activeTab === 'specs' ? 'text-white' : 'text-gray-500 hover:text-white'
            }`}
          >
            Specifications
            {activeTab === 'specs' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-luxury-gold" />}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`font-playfair text-xl tracking-wider uppercase focus:outline-none transition-colors duration-200 relative py-2 ${
              activeTab === 'reviews' ? 'text-white' : 'text-gray-500 hover:text-white'
            }`}
          >
            Reviews ({reviews.length})
            {activeTab === 'reviews' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-luxury-gold" />}
          </button>
        </div>

        {/* Specifications Tab */}
        {activeTab === 'specs' && (
          <div className="max-w-2xl space-y-4">
            {/* Category / Movement / Dial specs */}
            <div className="grid grid-cols-2 py-3 border-b border-white/5 text-sm font-light">
              <span className="text-gray-500">Movement Type</span>
              <span className="text-white font-medium">{product.movement}</span>
            </div>
            <div className="grid grid-cols-2 py-3 border-b border-white/5 text-sm font-light">
              <span className="text-gray-500">Dial Color</span>
              <span className="text-white font-medium">{product.dialColor}</span>
            </div>
            <div className="grid grid-cols-2 py-3 border-b border-white/5 text-sm font-light">
              <span className="text-gray-500">Gender classification</span>
              <span className="text-white font-medium">{product.gender}</span>
            </div>
            {/* Custom product specifications list */}
            {product.specifications?.map((spec, index) => (
              <div key={index} className="grid grid-cols-2 py-3 border-b border-white/5 text-sm font-light">
                <span className="text-gray-500">{spec.label}</span>
                <span className="text-white font-medium">{spec.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {/* Review listings */}
            <div className="lg:col-span-2 space-y-6">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <GlassCard key={rev._id} className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-poppins text-xs font-semibold uppercase text-white tracking-wider">
                          {rev.user?.name}
                        </h4>
                        <span className="text-[10px] text-gray-500 font-light">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex text-luxury-gold space-x-0.5">
                        {[...Array(5)].map((_, i) => (
                          <FiStar 
                            key={i} 
                            size={12} 
                            fill={i < rev.rating ? 'currentColor' : 'none'} 
                            className="stroke-1" 
                          />
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-300 font-light leading-relaxed">
                      {rev.comment}
                    </p>
                    
                    {rev.isVerifiedBuyer && (
                      <span className="inline-flex items-center text-[9px] bg-green-500/10 border border-green-500/20 text-green-400 uppercase tracking-widest px-2 py-0.5 rounded-sm">
                        Verified Purchase
                      </span>
                    )}
                  </GlassCard>
                ))
              ) : (
                <p className="text-gray-500 text-sm font-light">Be the first to review this timepiece.</p>
              )}
            </div>

            {/* Write a review form */}
            <div className="bg-[#121212]/40 border border-white/5 p-6 rounded-lg backdrop-blur-md">
              <h3 className="font-playfair text-lg text-white uppercase tracking-wider mb-4">Write a Review</h3>
              
              {user ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {/* Rating Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Select Rating</label>
                    <div className="flex text-luxury-gold space-x-1.5 cursor-pointer">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="focus:outline-none"
                        >
                          <FiStar 
                            size={20} 
                            fill={star <= reviewRating ? 'currentColor' : 'none'} 
                            className="transition-colors duration-150 stroke-1"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment box */}
                  <div className="space-y-1.5">
                    <label htmlFor="review-comment" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Your Review</label>
                    <textarea
                      id="review-comment"
                      rows="4"
                      placeholder="Share your thoughts on the craftsmanship, fit, and appearance..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                      className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded p-3 text-xs focus:outline-none text-white placeholder-gray-700 leading-relaxed font-light resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full btn-gold py-3 text-xs font-bold"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <p className="text-xs text-gray-500 font-light leading-relaxed">
                    Please log in to your account to review this luxury timepiece.
                  </p>
                  <Link to="/login" className="btn-outline-gold px-4 py-2 text-[10px] inline-block font-semibold">
                    Login
                  </Link>
                </div>
              )}
            </div>

          </div>
        )}
      </section>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="mt-28 border-t border-white/5 pt-16">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs uppercase tracking-widest text-luxury-gold font-semibold">Complete the Collection</span>
            <h2 className="font-playfair text-2xl uppercase tracking-wider text-white">Related Timepieces</h2>
            <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-2" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.slice(0, 3).map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default ProductDetails;
