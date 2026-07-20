import React, { useEffect, useState } from 'react';
import { FiShoppingBag, FiTruck, FiCheck, FiRefreshCw } from 'react-icons/fi';
import API from '../services/api.js';
import AdminSidebar from '../components/admin/AdminSidebar.jsx';
import GlassCard from '../components/common/GlassCard.jsx';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for tracking status changes in columns
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrdersList = async () => {
    setLoading(true);
    try {
      const res = await API.get('/orders');
      setOrders(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to sync orders logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersList();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await API.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      toast.success(`Order status updated to: ${newStatus}`);
      fetchOrdersList();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePaidToggle = async (orderId, currentPaidStatus) => {
    setUpdatingId(orderId);
    try {
      await API.put(`/orders/${orderId}/status`, { isPaid: !currentPaidStatus });
      toast.success(`Payment status marked as ${!currentPaidStatus ? 'Paid' : 'Unpaid'}`);
      fetchOrdersList();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update payment status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleTrackingSubmit = async (e, orderId, trackingNum) => {
    e.preventDefault();
    setUpdatingId(orderId);
    try {
      await API.put(`/orders/${orderId}/status`, { trackingNumber: trackingNum });
      toast.success('Tracking number updated.');
      fetchOrdersList();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update tracking details.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        
        <AdminSidebar />

        <div className="flex-grow w-full lg:w-3/4 space-y-6">
          
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h1 className="font-playfair text-3xl uppercase text-white tracking-wider">Orders log</h1>
              <p className="text-xs text-gray-500 font-light mt-1">Dispatch timepieces, adjust statuses, verify payment receipt records.</p>
            </div>
            <button
              onClick={fetchOrdersList}
              className="p-2.5 rounded bg-luxury-gray/40 border border-white/5 hover:border-luxury-gold/50 text-gray-300 hover:text-white transition-all duration-200"
              aria-label="Refresh list"
            >
              <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-500 font-light text-xs animate-pulse">
              Syncing order transaction logs...
            </div>
          ) : (
            <GlassCard className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-light">
                  <thead className="bg-[#121212] uppercase text-[10px] tracking-wider text-gray-500 border-b border-white/5">
                    <tr>
                      <th className="p-4 font-semibold">Order ID</th>
                      <th className="p-4 font-semibold">Client details</th>
                      <th className="p-4 font-semibold">Order Total</th>
                      <th className="p-4 font-semibold">Gateway / Paid</th>
                      <th className="p-4 font-semibold">Shipping details</th>
                      <th className="p-4 font-semibold">Dispatch status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-white/5 transition-colors">
                        
                        {/* ID */}
                        <td className="p-4 font-mono font-medium text-white select-all">
                          {ord._id.substring(ord._id.length - 8)}
                        </td>

                        {/* User Details */}
                        <td className="p-4 leading-normal">
                          <p className="font-medium text-white">{ord.user?.name || 'Guest'}</p>
                          <p className="text-[10px] text-gray-500">{ord.user?.email || 'N/A'}</p>
                        </td>

                        {/* Pricing */}
                        <td className="p-4 font-medium font-poppins text-white">
                          PKR {ord.totalPrice.toLocaleString()}
                        </td>

                        {/* Payment method and isPaid */}
                        <td className="p-4">
                          <span className="block uppercase text-[10px] text-gray-400 mb-1">{ord.paymentMethod}</span>
                          <button
                            disabled={updatingId === ord._id}
                            onClick={() => handlePaidToggle(ord._id, ord.isPaid)}
                            className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded-sm border focus:outline-none transition-colors ${
                              ord.isPaid 
                                ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-950/20' 
                                : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-950/20'
                            }`}
                          >
                            {ord.isPaid ? 'Paid' : 'Unpaid'}
                          </button>
                        </td>

                        {/* Tracking Input */}
                        <td className="p-4">
                          <form 
                            onSubmit={(e) => {
                              const inputVal = e.target.elements[`track-${ord._id}`].value;
                              handleTrackingSubmit(e, ord._id, inputVal);
                            }}
                            className="flex items-center gap-1"
                          >
                            <input
                              type="text"
                              name={`track-${ord._id}`}
                              defaultValue={ord.trackingNumber || ''}
                              placeholder="Add tracking #"
                              className="bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-2 py-1.5 text-[10px] text-white focus:outline-none placeholder-gray-800 w-28"
                            />
                            <button
                              type="submit"
                              disabled={updatingId === ord._id}
                              className="p-1.5 rounded bg-luxury-gold text-luxury-black font-bold focus:outline-none"
                              aria-label="Confirm tracking number"
                            >
                              <FiCheck size={10} />
                            </button>
                          </form>
                        </td>

                        {/* Order status dropdown */}
                        <td className="p-4">
                          <select
                            disabled={updatingId === ord._id}
                            value={ord.orderStatus}
                            onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                            className="bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-2.5 py-1.5 text-[10px] text-white focus:outline-none font-medium w-28"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
