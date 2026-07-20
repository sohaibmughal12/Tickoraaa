import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiMapPin, FiCreditCard, FiCheckCircle, FiChevronRight, FiShoppingBag } from 'react-icons/fi';
import { CartContext } from '../context/CartContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import API from '../services/api.js';
import GlassCard from '../components/common/GlassCard.jsx';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  
  const { cartItems, appliedCoupon, getSubtotal, getDiscount, getTax, getShipping, getTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Form hooks
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  // Redirect if cart empty
  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty. Please add products first.');
      navigate('/shop');
    }
  }, [cartItems, navigate]);

  // Autofill user details if logged in
  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
      if (user.addresses && user.addresses.length > 0) {
        const defAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
        setValue('street', defAddr.street);
        setValue('city', defAddr.city);
        setValue('state', defAddr.state);
        setValue('zip', defAddr.zip);
        setValue('phone', defAddr.phone);
      }
    }
  }, [user, setValue]);

  const [shippingDetails, setShippingDetails] = useState(null);

  const handleShippingSubmit = (data) => {
    setShippingDetails(data);
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setSubmittingOrder(true);
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price,
          selectedColor: item.selectedColor,
          selectedStrap: item.selectedStrap
        })),
        shippingAddress: {
          street: shippingDetails.street,
          city: shippingDetails.city,
          state: shippingDetails.state,
          zip: shippingDetails.zip,
          phone: shippingDetails.phone
        },
        paymentMethod,
        couponCode: appliedCoupon?.code || null,
        shippingPrice: getShipping(),
        taxPrice: getTax(),
        discountPrice: getDiscount(),
        totalPrice: getTotal()
      };

      const res = await API.post('/orders', orderData);
      
      toast.success('Order placed successfully!');
      clearCart();
      
      // Redirect to Order Success screen
      navigate(`/order-success/${res.data.data.order._id}`);
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error(error.response?.data?.message || 'Failed to submit order. Please try again.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
      
      {/* Page Title */}
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-3xl sm:text-5xl font-playfair uppercase tracking-wider text-white">Checkout</h1>
        <p className="text-xs uppercase tracking-widest text-luxury-gold">Securely finalize your purchase</p>
        <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-2" />
      </div>

      {/* Checkout Steps bar */}
      <div className="flex justify-center items-center space-x-4 mb-12 text-xs sm:text-sm uppercase tracking-widest">
        <span className={`pb-2 border-b-2 font-medium transition-all duration-300 ${step >= 1 ? 'border-luxury-gold text-white font-semibold' : 'border-transparent text-gray-500'}`}>
          1. Shipping
        </span>
        <FiChevronRight className="text-gray-600" />
        <span className={`pb-2 border-b-2 font-medium transition-all duration-300 ${step >= 2 ? 'border-luxury-gold text-white font-semibold' : 'border-transparent text-gray-500'}`}>
          2. Payment
        </span>
        <FiChevronRight className="text-gray-600" />
        <span className={`pb-2 border-b-2 font-medium transition-all duration-300 ${step >= 3 ? 'border-luxury-gold text-white font-semibold' : 'border-transparent text-gray-500'}`}>
          3. Confirm
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* Main interactive panel */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* STEP 1: SHIPPING ADDRESS */}
          {step === 1 && (
            <GlassCard className="p-8">
              <h3 className="font-playfair text-xl text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <FiMapPin className="text-luxury-gold" />
                <span>Shipping Address</span>
              </h3>
              
              <form onSubmit={handleSubmit(handleShippingSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1 sm:col-span-2">
                  <label htmlFor="name-input" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Recipient Name</label>
                  <input
                    type="text"
                    id="name-input"
                    placeholder="Sohaib Khan"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                  />
                  {errors.name && <span className="text-[10px] text-red-500">{errors.name.message}</span>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="email-input" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Email Address</label>
                  <input
                    type="email"
                    id="email-input"
                    placeholder="sohaib@tickora.com"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email structure' }
                    })}
                    className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                  />
                  {errors.email && <span className="text-[10px] text-red-500">{errors.email.message}</span>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="phone-input" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Phone Number</label>
                  <input
                    type="tel"
                    id="phone-input"
                    placeholder="+92 300 1234567"
                    {...register('phone', { required: 'Phone is required' })}
                    className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                  />
                  {errors.phone && <span className="text-[10px] text-red-500">{errors.phone.message}</span>}
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label htmlFor="street-input" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Street Address</label>
                  <input
                    type="text"
                    id="street-input"
                    placeholder="House #24, Block G-3, Phase 5, DHA"
                    {...register('street', { required: 'Street is required' })}
                    className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                  />
                  {errors.street && <span className="text-[10px] text-red-500">{errors.street.message}</span>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="city-input" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">City</label>
                  <input
                    type="text"
                    id="city-input"
                    placeholder="Lahore"
                    {...register('city', { required: 'City is required' })}
                    className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                  />
                  {errors.city && <span className="text-[10px] text-red-500">{errors.city.message}</span>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="state-input" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">State / Province</label>
                  <input
                    type="text"
                    id="state-input"
                    placeholder="Punjab"
                    {...register('state', { required: 'State is required' })}
                    className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                  />
                  {errors.state && <span className="text-[10px] text-red-500">{errors.state.message}</span>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="zip-input" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Postal / ZIP Code</label>
                  <input
                    type="text"
                    id="zip-input"
                    placeholder="54000"
                    {...register('zip', { required: 'ZIP is required' })}
                    className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                  />
                  {errors.zip && <span className="text-[10px] text-red-500">{errors.zip.message}</span>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="country-input" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Country</label>
                  <input
                    type="text"
                    id="country-input"
                    value="Pakistan"
                    disabled
                    className="w-full bg-[#0b0b0b] border border-white/5 rounded px-4 py-3 text-xs focus:outline-none text-gray-500 font-light"
                  />
                </div>

                <div className="sm:col-span-2 pt-4 border-t border-white/5 flex justify-end">
                  <button type="submit" className="btn-gold text-xs">
                    Continue to Payment
                  </button>
                </div>
              </form>
            </GlassCard>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {step === 2 && (
            <GlassCard className="p-8 space-y-8">
              <h3 className="font-playfair text-xl text-white uppercase tracking-wider flex items-center gap-2">
                <FiCreditCard className="text-luxury-gold" />
                <span>Select Payment Gateway</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'cod', label: 'Cash on Delivery', desc: 'Settle order at your doorstep.' },
                  { id: 'stripe', label: 'Credit / Debit Card', desc: 'Secure online processing via Stripe.' },
                  { id: 'jazzcash', label: 'JazzCash Wallet', desc: 'Pay instantly via mobile app/PIN.' },
                  { id: 'easypaisa', label: 'Easypaisa Wallet', desc: 'Pay via OTC/Mobile Wallet.' },
                  { id: 'bank_transfer', label: 'Direct Bank Transfer', desc: 'Send funds directly to our account.' },
                  { id: 'postex', label: 'PostEx COD Delivery', desc: 'Next-day delivery with cash settlement.' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPaymentMethod(item.id)}
                    className={`p-4 border rounded-lg text-left transition-all duration-300 ${
                      paymentMethod === item.id 
                        ? 'border-luxury-gold bg-luxury-gold/5 shadow-gold-glow' 
                        : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    <h4 className="font-poppins text-xs font-semibold uppercase text-white tracking-wider mb-1">{item.label}</h4>
                    <p className="text-[10px] text-gray-500 leading-normal font-light">{item.desc}</p>
                  </button>
                ))}
              </div>

              {/* Specific payment options layouts */}
              {paymentMethod === 'stripe' && (
                <div className="bg-[#121212] border border-white/5 p-6 rounded-lg space-y-4">
                  <h4 className="font-playfair text-sm text-white uppercase tracking-wider">Credit Card Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1 sm:col-span-3">
                      <label htmlFor="card-number" className="block text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Card Number</label>
                      <input 
                        type="text" 
                        id="card-number"
                        placeholder="4242 4242 4242 4242 (Stripe Mock)" 
                        className="w-full bg-[#0b0b0b] border border-white/5 rounded px-4 py-2.5 text-xs text-white focus:outline-none placeholder-gray-800 font-light"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label htmlFor="expiry-input" className="block text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Expiration Date</label>
                      <input 
                        type="text" 
                        id="expiry-input"
                        placeholder="MM / YY" 
                        className="w-full bg-[#0b0b0b] border border-white/5 rounded px-4 py-2.5 text-xs text-white focus:outline-none placeholder-gray-800 font-light"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="cvc-input" className="block text-[10px] uppercase tracking-widest text-gray-500 font-semibold">CVC / CVV</label>
                      <input 
                        type="text" 
                        id="cvc-input"
                        placeholder="123" 
                        className="w-full bg-[#0b0b0b] border border-white/5 rounded px-4 py-2.5 text-xs text-white focus:outline-none placeholder-gray-800 font-light"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'bank_transfer' && (
                <div className="bg-luxury-gold/5 border border-luxury-gold/15 p-6 rounded-lg text-xs leading-relaxed text-gray-300 font-light space-y-3">
                  <h4 className="font-playfair text-sm text-luxury-gold uppercase tracking-wider font-semibold">Direct Bank Transfer Details</h4>
                  <p>Please transfer the order total amount to our bank account. Note your Order ID as reference:</p>
                  <ul className="space-y-1 pt-1 font-poppins">
                    <li>Bank Name: <span className="text-white font-medium">Alfa Bank Ltd</span></li>
                    <li>Account Title: <span className="text-white font-medium">Tickora Luxury Brands</span></li>
                    <li>Account Number: <span className="text-white font-medium">1023-9874523-91</span></li>
                    <li>IBAN Code: <span className="text-white font-medium">PK89ALFA1023987452391</span></li>
                  </ul>
                  <p className="text-[10px] text-gray-500">Note: Your order will enter 'Pending' status. Once bank settlement is verified by our finance team, the order status will update to 'Confirmed'.</p>
                </div>
              )}

              {['jazzcash', 'easypaisa'].includes(paymentMethod) && (
                <div className="bg-[#121212] border border-white/5 p-6 rounded-lg space-y-4">
                  <h4 className="font-playfair text-sm text-white uppercase tracking-wider">{paymentMethod === 'jazzcash' ? 'JazzCash' : 'Easypaisa'} Wallet Number</h4>
                  <div className="space-y-1">
                    <label htmlFor="wallet-phone" className="block text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Mobile Wallet Account Number</label>
                    <input 
                      type="tel" 
                      id="wallet-phone"
                      placeholder="e.g. 03001234567" 
                      className="w-full bg-[#0b0b0b] border border-white/5 rounded px-4 py-2.5 text-xs text-white focus:outline-none placeholder-gray-800 font-light"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500">An automatic pop-up prompt will appear on your registered smartphone prompting for your wallet PIN.</p>
                </div>
              )}

              <div className="pt-4 border-t border-white/5 flex justify-between">
                <button 
                  onClick={() => setStep(1)}
                  className="btn-outline-gold text-xs"
                >
                  Back
                </button>
                <button 
                  onClick={() => setStep(3)}
                  className="btn-gold text-xs"
                >
                  Continue to Confirmation
                </button>
              </div>
            </GlassCard>
          )}

          {/* STEP 3: ORDER CONFIRMATION */}
          {step === 3 && (
            <GlassCard className="p-8 space-y-6">
              <h3 className="font-playfair text-xl text-white uppercase tracking-wider flex items-center gap-2">
                <FiCheckCircle className="text-luxury-gold" />
                <span>Confirm Your Order</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-light leading-relaxed">
                <div className="bg-[#121212] p-4 border border-white/5 rounded">
                  <h4 className="font-playfair text-xs uppercase tracking-widest text-luxury-gold mb-2">Delivery Information</h4>
                  <p className="font-medium text-white">{shippingDetails?.name}</p>
                  <p className="text-xs text-gray-400">{shippingDetails?.phone}</p>
                  <p className="text-xs text-gray-400">{shippingDetails?.street}, {shippingDetails?.city}, {shippingDetails?.state}</p>
                  <p className="text-xs text-gray-400">Postal Code: {shippingDetails?.zip}</p>
                </div>

                <div className="bg-[#121212] p-4 border border-white/5 rounded">
                  <h4 className="font-playfair text-xs uppercase tracking-widest text-luxury-gold mb-2">Payment Setup</h4>
                  <p className="font-medium text-white uppercase">{paymentMethod.replace('_', ' ')}</p>
                  <p className="text-xs text-gray-400">Order will enter settlement processing once placed.</p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex justify-between">
                <button 
                  onClick={() => setStep(2)}
                  className="btn-outline-gold text-xs"
                >
                  Back
                </button>
                <button 
                  onClick={handlePlaceOrder}
                  disabled={submittingOrder}
                  className="btn-gold text-xs px-8 font-black flex items-center space-x-2"
                >
                  {submittingOrder ? (
                    <span>Placing Order...</span>
                  ) : (
                    <>
                      <FiShoppingBag size={14} />
                      <span>Place My Order</span>
                    </>
                  )}
                </button>
              </div>
            </GlassCard>
          )}

        </div>

        {/* Right Sidebar: Item summary details */}
        <aside className="space-y-6">
          <GlassCard className="p-6 space-y-6">
            <h3 className="font-playfair text-base text-white uppercase tracking-wider border-b border-white/5 pb-4">
              Your Selection
            </h3>

            {/* Items list */}
            <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.key} className="flex gap-4 items-center">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded border border-white/5" />
                  <div className="flex-grow text-xs leading-normal font-light">
                    <h4 className="text-white font-medium line-clamp-1">{item.name}</h4>
                    {item.selectedColor && <span className="text-[10px] text-gray-500 block">Dial: {item.selectedColor}</span>}
                    <span className="text-[10px] text-gray-400 block">{item.quantity} x PKR {item.price.toLocaleString()}</span>
                  </div>
                  <span className="text-xs font-semibold text-white font-poppins">
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Prices details */}
            <div className="border-t border-white/5 pt-4 space-y-2.5 text-xs font-light text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-medium">PKR {getSubtotal().toLocaleString()}</span>
              </div>
              {getDiscount() > 0 && (
                <div className="flex justify-between text-luxury-gold">
                  <span>Applied Coupon Discount</span>
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
              <div className="flex justify-between font-poppins border-t border-white/5 pt-4 text-sm">
                <span className="uppercase text-white">Grand Total</span>
                <span className="font-bold text-luxury-gold">PKR {getTotal().toLocaleString()}</span>
              </div>
            </div>
          </GlassCard>
        </aside>

      </div>

    </div>
  );
};

export default Checkout;
