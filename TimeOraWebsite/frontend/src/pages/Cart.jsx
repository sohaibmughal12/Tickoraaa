import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiTag, FiX } from 'react-icons/fi';
import { CartContext } from '../context/CartContext.jsx';
import GlassCard from '../components/common/GlassCard.jsx';
import toast from 'react-hot-toast';

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    appliedCoupon,
    updateQuantity,
    removeFromCart,
    applyCouponCode,
    removeCouponCode,
    getSubtotal,
    getDiscount,
    getTax,
    getShipping,
    getTotal
  } = useContext(CartContext);

  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setApplying(true);
    const res = await applyCouponCode(couponInput);
    setApplying(false);

    if (res.success) {
      toast.success(res.message);
      setCouponInput('');
    } else {
      toast.error(res.message);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
      {/* Title banner */}
      <div className="text-center space-y-3 mb-12">
        <h1 className="text-3xl sm:text-5xl font-playfair uppercase tracking-wider text-white">Shopping Cart</h1>
        <p className="text-xs uppercase tracking-widest text-luxury-gold">Review your premium selections</p>
        <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-2" />
      </div>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div 
                key={item.key}
                className="flex flex-col sm:flex-row items-center bg-[#121212]/40 border border-white/5 p-6 rounded-lg gap-6 shadow-luxury-soft"
              >
                {/* Product Image */}
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-24 h-24 object-cover rounded border border-white/5"
                />

                {/* Details */}
                <div className="flex-grow text-center sm:text-left space-y-1">
                  <h3 className="font-playfair text-base text-white hover:text-luxury-gold transition-colors duration-200">
                    <Link to={`/products/${item.sku}`}>{item.name}</Link>
                  </h3>
                  <div className="text-xs text-gray-500 font-light space-x-3">
                    {item.selectedColor && <span>Dial: <span className="text-white">{item.selectedColor}</span></span>}
                    {item.selectedStrap && <span>Strap: <span className="text-white">{item.selectedStrap}</span></span>}
                  </div>
                  <span className="text-[10px] text-gray-600 block uppercase font-light">SKU: {item.sku}</span>
                </div>

                {/* Quantity picker */}
                <div className="flex items-center border border-white/10 rounded overflow-hidden bg-[#0b0b0b]">
                  <button 
                    onClick={() => updateQuantity(item.key, item.quantity - 1)}
                    className="px-3 py-1.5 text-gray-400 hover:text-white focus:outline-none transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.key, item.quantity + 1)}
                    className="px-3 py-1.5 text-gray-400 hover:text-white focus:outline-none transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Price total */}
                <div className="text-center sm:text-right font-poppins min-w-[100px]">
                  <span className="text-sm font-semibold text-white">
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-600 block font-light">
                    PKR {item.price.toLocaleString()} each
                  </span>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => {
                    removeFromCart(item.key);
                    toast.success(`${item.name} removed from cart.`);
                  }}
                  className="text-gray-500 hover:text-red-500 transition-colors focus:outline-none"
                  aria-label="Remove item"
                >
                  <FiTrash2 size={16} />
                </button>

              </div>
            ))}

            {/* Coupon Code Panel */}
            <GlassCard className="p-6">
              <h3 className="font-playfair text-base text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <FiTag className="text-luxury-gold" />
                <span>Promotional Coupon Code</span>
              </h3>
              
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-luxury-gold/5 border border-luxury-gold/20 p-4 rounded text-sm text-luxury-gold font-light">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold uppercase tracking-wider">{appliedCoupon.code}</span>
                    <span>applied (Discount of PKR {appliedCoupon.discountCalculated.toLocaleString()})</span>
                  </div>
                  <button 
                    onClick={removeCouponCode}
                    className="text-gray-400 hover:text-white focus:outline-none"
                    aria-label="Remove coupon"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Enter coupon code (e.g. TICKORA10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-2.5 text-xs focus:outline-none text-white w-full uppercase font-light tracking-widest placeholder-gray-700"
                  />
                  <button
                    type="submit"
                    disabled={applying || !couponInput.trim()}
                    className="btn-outline-gold px-6 py-2.5 text-xs font-semibold whitespace-nowrap disabled:opacity-50"
                  >
                    {applying ? 'Applying...' : 'Apply'}
                  </button>
                </form>
              )}
            </GlassCard>
          </div>

          {/* Checkout pricing Summary Sidebar */}
          <aside className="space-y-6">
            <GlassCard className="p-6 space-y-4">
              <h3 className="font-playfair text-base text-white uppercase tracking-wider border-b border-white/5 pb-4">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs font-light text-gray-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">PKR {getSubtotal().toLocaleString()}</span>
                </div>
                
                {getDiscount() > 0 && (
                  <div className="flex justify-between text-luxury-gold">
                    <span>Discount</span>
                    <span>- PKR {getDiscount().toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-white font-medium">
                    {getShipping() === 0 ? 'Free Shipping' : `PKR ${getShipping().toLocaleString()}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated Tax (GST 5%)</span>
                  <span className="text-white font-medium">PKR {getTax().toLocaleString()}</span>
                </div>
              </div>

              {/* Free shipping progress indicator */}
              {getSubtotal() < 20000 && (
                <p className="text-[10px] text-gray-500 font-light text-center bg-white/5 p-2 rounded border border-white/5">
                  Add <span className="text-white font-semibold">PKR {(20000 - getSubtotal()).toLocaleString()}</span> more for <span className="text-luxury-gold font-semibold">Free Shipping</span>!
                </p>
              )}

              <div className="flex justify-between font-poppins border-t border-white/5 pt-4">
                <span className="text-sm uppercase tracking-wider text-white">Grand Total</span>
                <span className="text-base font-bold text-luxury-gold">
                  PKR {getTotal().toLocaleString()}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full btn-gold py-3.5 text-xs font-bold mt-4"
              >
                Proceed to Checkout
              </button>

              <div className="text-center pt-2">
                <Link to="/shop" className="text-[10px] text-luxury-gold hover:underline uppercase tracking-widest font-semibold">
                  Continue Shopping
                </Link>
              </div>
            </GlassCard>
          </aside>

        </div>
      ) : (
        <div className="text-center py-20 bg-[#121212]/10 border border-white/5 rounded-lg max-w-md mx-auto">
          <FiShoppingBag size={48} className="text-gray-600 mx-auto mb-4 stroke-1" />
          <h3 className="font-playfair text-xl text-white mb-2">Your cart is empty</h3>
          <p className="text-xs text-gray-500 font-light leading-relaxed mb-6">
            Looks like you haven't selected any luxury timepieces yet.
          </p>
          <Link to="/shop" className="btn-gold text-xs">Shop Timepieces</Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
