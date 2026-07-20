import React, { useEffect, useState } from 'react';
import { FiStar, FiCheck, FiX, FiTrash2 } from 'react-icons/fi';
import API from '../services/api.js';
import AdminSidebar from '../components/admin/AdminSidebar.jsx';
import GlassCard from '../components/common/GlassCard.jsx';
import toast from 'react-hot-toast';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchReviewsList = async () => {
    setLoading(true);
    try {
      const res = await API.get('/reviews/admin-list');
      setReviews(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to sync reviews catalog.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviewsList();
  }, []);

  const handleApproveToggle = async (revId, currentStatus) => {
    setUpdatingId(revId);
    try {
      await API.put(`/reviews/${revId}/approve`, { isApproved: !currentStatus });
      toast.success(`Review ${!currentStatus ? 'Approved' : 'Moved back to moderation queue'}`);
      fetchReviewsList();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to toggle review approval.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteReview = async (revId) => {
    if (!window.confirm('Are you sure you want to delete this review permanently?')) return;

    setUpdatingId(revId);
    try {
      await API.delete(`/reviews/${revId}`);
      toast.success('Review removed.');
      fetchReviewsList();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete review.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        
        <AdminSidebar />

        <div className="flex-grow w-full lg:w-3/4 space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h1 className="font-playfair text-3xl uppercase text-white tracking-wider">Reviews Moderation</h1>
            <p className="text-xs text-gray-500 font-light mt-1">Approve verified customer remarks to display them in product spec details.</p>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-500 font-light text-xs animate-pulse">
              Syncing reviews moderations catalogue...
            </div>
          ) : (
            <GlassCard className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-light">
                  <thead className="bg-[#121212] uppercase text-[10px] tracking-wider text-gray-500 border-b border-white/5">
                    <tr>
                      <th className="p-4 font-semibold">Watch Model</th>
                      <th className="p-4 font-semibold">Customer info</th>
                      <th className="p-4 font-semibold">Rating / Comment</th>
                      <th className="p-4 font-semibold">Purchase status</th>
                      <th className="p-4 font-semibold">Moderation</th>
                      <th className="p-4 font-semibold">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {reviews.map((rev) => (
                      <tr key={rev._id} className="hover:bg-white/5 transition-colors">
                        
                        {/* Product details */}
                        <td className="p-4 font-medium text-white max-w-[150px] truncate">
                          {rev.product?.name || 'Deleted Watch'}
                          <span className="block text-[10px] text-gray-500 font-mono mt-0.5">{rev.product?.sku || 'N/A'}</span>
                        </td>

                        {/* Customer */}
                        <td className="p-4">
                          <p className="font-medium text-white">{rev.user?.name || 'Unknown'}</p>
                          <p className="text-[10px] text-gray-500">{rev.user?.email || 'N/A'}</p>
                        </td>

                        {/* Rating/Comment */}
                        <td className="p-4 max-w-sm">
                          <div className="flex text-luxury-gold space-x-0.5 mb-1.5">
                            {[...Array(5)].map((_, i) => (
                              <FiStar 
                                key={i} 
                                size={11} 
                                fill={i < rev.rating ? 'currentColor' : 'none'} 
                                className="stroke-1" 
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-300 font-light leading-relaxed line-clamp-2 select-all">{rev.comment}</p>
                        </td>

                        {/* Verified Buyer */}
                        <td className="p-4 text-center">
                          <span className={`px-2 py-0.5 rounded-sm text-[9px] uppercase font-bold ${
                            rev.isVerifiedBuyer 
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                              : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                          }`}>
                            {rev.isVerifiedBuyer ? 'Verified' : 'General'}
                          </span>
                        </td>

                        {/* Toggle Moderation status */}
                        <td className="p-4">
                          <button
                            disabled={updatingId === rev._id}
                            onClick={() => handleApproveToggle(rev._id, rev.isApproved)}
                            className={`px-3 py-1.5 rounded text-[10px] uppercase font-bold flex items-center space-x-1.5 focus:outline-none transition-all duration-300 ${
                              rev.isApproved
                                ? 'bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-950/20'
                                : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-950/20'
                            }`}
                          >
                            {rev.isApproved ? (
                              <>
                                <FiCheck size={12} />
                                <span>Approved</span>
                              </>
                            ) : (
                              <>
                                <FiX size={12} />
                                <span>Approve</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Delete Review */}
                        <td className="p-4">
                          <button
                            disabled={updatingId === rev._id}
                            onClick={() => handleDeleteReview(rev._id)}
                            className="text-gray-500 hover:text-red-500 transition-colors focus:outline-none"
                            aria-label="Remove review"
                          >
                            <FiTrash2 size={14} />
                          </button>
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

export default AdminReviews;
