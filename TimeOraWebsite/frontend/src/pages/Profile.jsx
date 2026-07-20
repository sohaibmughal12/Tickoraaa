import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { FiTrendingUp, FiMapPin, FiUser, FiShoppingBag, FiTruck, FiLock, FiPlus, FiTrash2 } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext.jsx';
import API from '../services/api.js';
import GlassCard from '../components/common/GlassCard.jsx';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'addresses' | 'details'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  const { register: registerAddress, handleSubmit: handleAddressSubmit, reset: resetAddressForm, formState: { errors: addressErrors } } = useForm();
  const { register: registerDetails, handleSubmit: handleDetailsSubmit, formState: { errors: detailsErrors } } = useForm({
    defaultValues: {
      name: user?.name,
      email: user?.email
    }
  });

  // Fetch current user orders
  useEffect(() => {
    if (activeTab === 'orders') {
      setLoadingOrders(true);
      API.get('/orders/myorders')
        .then((res) => {
          setOrders(res.data.data);
        })
        .catch((err) => {
          console.error('Failed to fetch user orders list:', err);
          toast.error('Could not load orders history.');
        })
        .finally(() => setLoadingOrders(false));
    }
  }, [activeTab]);

  // Submit profile detail updates
  const onDetailsSubmit = async (data) => {
    const payload = {
      name: data.name,
      email: data.email
    };
    if (data.password) {
      payload.password = data.password;
    }

    const res = await updateProfile(payload);
    if (res.success) {
      toast.success('Profile details updated successfully.');
    } else {
      toast.error(res.message);
    }
  };

  // Submit address edits / creations
  const onAddressSubmit = async (data) => {
    setSavingAddress(true);
    try {
      const currentAddresses = user.addresses ? [...user.addresses] : [];
      const newAddress = {
        street: data.street,
        city: data.city,
        state: data.state,
        zip: data.zip,
        phone: data.phone,
        isDefault: currentAddresses.length === 0 ? true : data.isDefault || false
      };

      // If set as default, unset other defaults
      if (newAddress.isDefault) {
        currentAddresses.forEach(a => a.isDefault = false);
      }

      currentAddresses.push(newAddress);
      
      const res = await updateProfile({ addresses: currentAddresses });
      if (res.success) {
        toast.success('New address added successfully!');
        resetAddressForm();
        setShowAddressForm(false);
      } else {
        toast.error(res.message || 'Failed to save address.');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while saving address.');
    } finally {
      setSavingAddress(false);
    }
  };

  // Delete Address
  const handleDeleteAddress = async (addrId) => {
    if (!window.confirm('Are you sure you want to remove this address?')) return;

    try {
      const remainingAddresses = user.addresses.filter(a => a._id !== addrId);
      
      // Ensure there is still a default if there are addresses left
      if (remainingAddresses.length > 0 && !remainingAddresses.some(a => a.isDefault)) {
        remainingAddresses[0].isDefault = true;
      }

      const res = await updateProfile({ addresses: remainingAddresses });
      if (res.success) {
        toast.success('Address removed.');
      } else {
        toast.error(res.message || 'Failed to delete address.');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred during deletion.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
      {/* Welcome header */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="font-playfair text-3xl sm:text-4xl uppercase text-white tracking-wider">Hello, {user?.name.split(' ')[0]}</h1>
        <p className="text-xs text-gray-500 font-light mt-1">Manage your orders, credentials, and luxury delivery settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
        
        {/* Navigation Tabs List */}
        <aside className="space-y-4">
          <GlassCard className="p-4 flex flex-col space-y-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                activeTab === 'orders' ? 'bg-luxury-gold text-luxury-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <FiShoppingBag size={16} />
              <span>My Orders</span>
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                activeTab === 'addresses' ? 'bg-luxury-gold text-luxury-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <FiMapPin size={16} />
              <span>Address Book</span>
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                activeTab === 'details' ? 'bg-luxury-gold text-luxury-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <FiUser size={16} />
              <span>Account details</span>
            </button>
          </GlassCard>
        </aside>

        {/* Tab workspace area */}
        <div className="lg:col-span-3">
          
          {/* TAB 1: MY ORDERS LIST */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h3 className="font-playfair text-xl text-white uppercase tracking-wider mb-6">Order History</h3>
              
              {loadingOrders ? (
                <div className="py-12 text-center text-gray-500 font-light text-xs animate-pulse">
                  Syncing transaction records...
                </div>
              ) : orders.length > 0 ? (
                orders.map((ord) => (
                  <GlassCard key={ord._id} className="p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/5 pb-4 text-xs tracking-wider uppercase text-gray-500">
                      <div>
                        <span>Order placed: <span className="text-white font-medium">{new Date(ord.createdAt).toLocaleDateString()}</span></span>
                        <span className="block mt-1 sm:mt-0 sm:inline sm:ml-4">ID: <span className="text-white font-mono">{ord._id}</span></span>
                      </div>
                      <span className="text-luxury-gold font-bold">{ord.orderStatus}</span>
                    </div>

                    {/* Order summary stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-light text-gray-400">
                      <div>
                        <span className="block text-[10px] uppercase text-gray-600 font-semibold mb-0.5">Total Amount</span>
                        <p className="text-white font-medium">PKR {ord.totalPrice.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase text-gray-600 font-semibold mb-0.5">Method</span>
                        <p className="text-white uppercase font-medium">{ord.paymentMethod.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase text-gray-600 font-semibold mb-0.5">Paid Status</span>
                        <span className={ord.isPaid ? 'text-green-400 font-medium' : 'text-yellow-400 font-medium'}>{ord.isPaid ? 'Paid' : 'Pending Verification'}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase text-gray-600 font-semibold mb-0.5">Tracking Number</span>
                        <p className="text-white font-mono">{ord.trackingNumber || 'Unassigned'}</p>
                      </div>
                    </div>

                    {/* Items thumbnails list */}
                    <div className="flex flex-wrap gap-4 pt-2 border-t border-white/5">
                      {ord.orderItems.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-2 bg-black/30 border border-white/5 p-2 rounded">
                          <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded border border-white/5" />
                          <div className="text-[10px] leading-normal font-light">
                            <h4 className="text-white line-clamp-1 max-w-[150px]">{item.name}</h4>
                            <span className="text-gray-500">Qty: {item.quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                ))
              ) : (
                <div className="text-center py-16 bg-[#121212]/10 border border-white/5 rounded-lg">
                  <FiShoppingBag size={32} className="text-gray-600 mx-auto mb-3 stroke-1" />
                  <h4 className="font-playfair text-lg text-white mb-1">No orders found</h4>
                  <p className="text-xs text-gray-500 font-light mb-4">You haven't made any watch acquisitions yet.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADDRESS BOOK */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="font-playfair text-xl text-white uppercase tracking-wider">Address Book</h3>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="btn-outline-gold px-4 py-2 text-[10px] font-semibold flex items-center space-x-1"
                >
                  <FiPlus size={12} />
                  <span>{showAddressForm ? 'Cancel' : 'Add New'}</span>
                </button>
              </div>

              {/* Add Address Form toggle */}
              {showAddressForm && (
                <GlassCard className="p-6">
                  <form onSubmit={handleAddressSubmit(onAddressSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 sm:col-span-2">
                      <label htmlFor="street-input" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Street Address</label>
                      <input
                        type="text"
                        id="street-input"
                        placeholder="House #10, Block D, Model Town"
                        {...registerAddress('street', { required: 'Street is required' })}
                        className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                      />
                      {addressErrors.street && <span className="text-[10px] text-red-500">{addressErrors.street.message}</span>}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="city-input" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">City</label>
                      <input
                        type="text"
                        id="city-input"
                        placeholder="Lahore"
                        {...registerAddress('city', { required: 'City is required' })}
                        className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                      />
                      {addressErrors.city && <span className="text-[10px] text-red-500">{addressErrors.city.message}</span>}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="state-input" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">State / Province</label>
                      <input
                        type="text"
                        id="state-input"
                        placeholder="Punjab"
                        {...registerAddress('state', { required: 'State is required' })}
                        className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                      />
                      {addressErrors.state && <span className="text-[10px] text-red-500">{addressErrors.state.message}</span>}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="zip-input" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">ZIP Code</label>
                      <input
                        type="text"
                        id="zip-input"
                        placeholder="54700"
                        {...registerAddress('zip', { required: 'ZIP is required' })}
                        className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                      />
                      {addressErrors.zip && <span className="text-[10px] text-red-500">{addressErrors.zip.message}</span>}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="phone-input" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Phone Number</label>
                      <input
                        type="tel"
                        id="phone-input"
                        placeholder="+923219876543"
                        {...registerAddress('phone', { required: 'Phone is required' })}
                        className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                      />
                      {addressErrors.phone && <span className="text-[10px] text-red-500">{addressErrors.phone.message}</span>}
                    </div>

                    <div className="sm:col-span-2 flex items-center space-x-2.5 pt-2">
                      <input
                        type="checkbox"
                        id="isDefault"
                        {...registerAddress('isDefault')}
                        className="accent-luxury-gold border-white/10"
                      />
                      <label htmlFor="isDefault" className="text-xs text-gray-400 font-light cursor-pointer select-none">Set as primary delivery address</label>
                    </div>

                    <div className="sm:col-span-2 pt-4 border-t border-white/5 flex justify-end">
                      <button
                        type="submit"
                        disabled={savingAddress}
                        className="btn-gold text-xs"
                      >
                        {savingAddress ? 'Saving Address...' : 'Save Address'}
                      </button>
                    </div>
                  </form>
                </GlassCard>
              )}

              {/* Active list grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user.addresses && user.addresses.length > 0 ? (
                  user.addresses.map((addr) => (
                    <GlassCard key={addr._id} className="p-6 space-y-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">
                            {addr.isDefault ? (
                              <span className="bg-luxury-gold/15 border border-luxury-gold/25 text-luxury-gold px-2 py-0.5 rounded-sm">
                                Primary Address
                              </span>
                            ) : (
                              'Secondary'
                            )}
                          </span>
                          <button
                            onClick={() => handleDeleteAddress(addr._id)}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                            aria-label="Remove Address"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                        <p className="text-xs text-white leading-normal font-light">{addr.street}</p>
                        <p className="text-xs text-gray-400 font-light">{addr.city}, {addr.state} - {addr.zip}</p>
                        <p className="text-xs text-gray-500 font-light font-mono">Contact: {addr.phone}</p>
                      </div>
                    </GlassCard>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm font-light col-span-2 text-center py-6">No addresses registered. Please add one.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ACCOUNT DETAILS */}
          {activeTab === 'details' && (
            <GlassCard className="p-8">
              <h3 className="font-playfair text-xl text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <FiLock className="text-luxury-gold" />
                <span>Account Credentials</span>
              </h3>

              <form onSubmit={handleDetailsSubmit(onDetailsSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label htmlFor="details-name" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Full Name</label>
                    <input
                      type="text"
                      id="details-name"
                      {...registerDetails('name', { required: 'Name is required' })}
                      className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                    />
                    {detailsErrors.name && <span className="text-[10px] text-red-500">{detailsErrors.name.message}</span>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="details-email" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Email Address</label>
                    <input
                      type="email"
                      id="details-email"
                      {...registerDetails('email', { required: 'Email is required' })}
                      className="w-full bg-[#0b0b0b] border border-white/5 rounded px-4 py-3 text-xs focus:outline-none text-gray-500 font-light"
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="details-pass" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">New Password (Leave blank to keep unchanged)</label>
                  <input
                    type="password"
                    id="details-pass"
                    placeholder="••••••••"
                    {...registerDetails('password', {
                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                    className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                  />
                  {detailsErrors.password && <span className="text-[10px] text-red-500">{detailsErrors.password.message}</span>}
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end">
                  <button type="submit" className="btn-gold text-xs">
                    Update Credentials
                  </button>
                </div>
              </form>
            </GlassCard>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;
