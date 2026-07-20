import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist on initialization
  useEffect(() => {
    const savedWishlist = localStorage.getItem('tickora_wishlist');
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  }, []);

  // Save wishlist to local storage on modification
  useEffect(() => {
    localStorage.setItem('tickora_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Toggle item in wishlist
  const toggleWishlist = (product) => {
    const exists = wishlistItems.some((item) => item._id === product._id);

    if (exists) {
      setWishlistItems((prev) => prev.filter((item) => item._id !== product._id));
      toast.success(`${product.name} removed from Wishlist.`);
    } else {
      setWishlistItems((prev) => [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          discountPrice: product.discountPrice,
          image: product.images[0],
          sku: product.sku,
          stock: product.stock
        }
      ]);
      toast.success(`${product.name} added to Wishlist.`);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
