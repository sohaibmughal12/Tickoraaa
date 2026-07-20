import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api.js';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [shippingPrice, setShippingPrice] = useState(250); // Default PKR 250 shipping
  const [taxRate] = useState(0.05); // 5% standard GST

  // Load cart on init
  useEffect(() => {
    const savedCart = localStorage.getItem('tickora_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('tickora_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add Item to Cart
  const addToCart = (product, quantity = 1, selectedColor = '', selectedStrap = '') => {
    // Generate unique identifier for this product variation
    const itemKey = `${product._id}-${selectedColor}-${selectedStrap}`;

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.key === itemKey);

      if (existingItem) {
        // Update quantity
        return prevItems.map((item) =>
          item.key === itemKey
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      } else {
        // Add new item
        return [
          ...prevItems,
          {
            key: itemKey,
            _id: product._id,
            name: product.name,
            price: product.discountPrice || product.price,
            image: product.images[0],
            stock: product.stock,
            sku: product.sku,
            selectedColor,
            selectedStrap,
            quantity
          }
        ];
      }
    });
  };

  // Remove Item from Cart
  const removeFromCart = (itemKey) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.key !== itemKey));
  };

  // Update Item Quantity
  const updateQuantity = (itemKey, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemKey);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.key === itemKey ? { ...item, quantity } : item
      )
    );
  };

  // Clear Cart
  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem('tickora_cart');
  };

  // Apply Coupon code using API
  const applyCouponCode = async (code) => {
    try {
      const subtotal = getSubtotal();
      const res = await API.post('/coupons/apply', { code, cartSubtotal: subtotal });
      
      const couponData = res.data.data;
      setAppliedCoupon(couponData);
      return { success: true, message: 'Coupon applied successfully!' };
    } catch (error) {
      console.error('Coupon error:', error);
      const msg = error.response?.data?.message || 'Invalid or expired coupon code.';
      setAppliedCoupon(null);
      return { success: false, message: msg };
    }
  };

  // Remove applied coupon
  const removeCouponCode = () => {
    setAppliedCoupon(null);
  };

  // Subtotal Calculation
  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  // Discount Calculation
  const getDiscount = () => {
    if (!appliedCoupon) return 0;
    return appliedCoupon.discountCalculated;
  };

  // Tax Calculation (5% GST)
  const getTax = () => {
    return Math.round((getSubtotal() - getDiscount()) * taxRate);
  };

  // Shipping Calculation (Free over PKR 20,000)
  const getShipping = () => {
    const subtotal = getSubtotal();
    if (subtotal === 0 || subtotal >= 20000) return 0;
    return shippingPrice;
  };

  // Grand Total Calculation
  const getTotal = () => {
    const subtotal = getSubtotal();
    if (subtotal === 0) return 0;
    return Math.max(0, subtotal + getShipping() + getTax() - getDiscount());
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        appliedCoupon,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCouponCode,
        removeCouponCode,
        getSubtotal,
        getDiscount,
        getTax,
        getShipping,
        getTotal,
        cartCount: cartItems.reduce((acc, item) => acc + item.quantity, 0)
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
