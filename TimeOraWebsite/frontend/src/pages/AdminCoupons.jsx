import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiTrash2, FiTag, FiX } from 'react-icons/fi';
import API from '../services/api.js';
import AdminSidebar from '../components/admin/AdminSidebar.jsx';
import GlassCard from '../components/common/GlassCard.jsx';
import toast from 'react-hot-toast';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchCouponsList = async () => {
    setLoading(true);
    try {
      const res = await API.get('/coupons');
      setCoupons(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to sync coupon databases.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCouponsList();
  }, []);

  const onCouponSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        code: data.code.toUpperCase().trim(),
        discountType: data.discountType,
        discountAmount: Number(data.discountAmount),
        minOrderAmount: data.minOrderAmount ? Number(data.minOrderAmount) : 0,
        maxDiscountAmount: data.maxDiscountAmount ? Number(data.maxDiscountAmount) : null,
        expiryDate: data.expiryDate,
        usageLimit: data.usageLimit ? Number(data.usageLimit) : null
      };

      await API.post('/coupons', payload);
      toast.success('Promo code created successfully!');
      reset();
      setShowForm(false);
      fetchCouponsList();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error occurred while saving coupon.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (id, code) => {
    if (!window.confirm(`Are you sure you want to delete coupon: ${code}?`)) return;

    try {
      await API.delete(`/coupons/${id}`);
      toast.success(`Coupon ${code} removed.`);
      fetchCouponsList();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete coupon.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        
        <AdminSidebar />

        <div className="flex-grow w-full lg:w-3/4 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h1 className="font-playfair text-3xl uppercase text-white tracking-wider">Promo Coupons</h1>
              <p className="text-xs text-gray-500 font-light mt-1">Configure discount rates, validation periods, and usage caps.</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-gold px-5 py-2.5 text-xs font-semibold flex items-center space-x-1.5"
            >
              <FiPlus size={14} />
              <span>{showForm ? 'Cancel' : 'Create Coupon'}</span>
            </button>
          </div>

          {/* Create Coupon form panel toggle */}
          {showForm && (
            <GlassCard className="p-8 relative">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white focus:outline-none"
                aria-label="Close form"
              >
                <FiX size={20} />
              </button>

              <h3 className="font-playfair text-xl text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <FiTag className="text-luxury-gold" />
                <span>Issue New Promo Coupon</span>
              </h3>

              <form onSubmit={handleSubmit(onCouponSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Code */}
                <div className="space-y-1">
                  <label htmlFor="coupon-code" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Coupon Code</label>
                  <input
                    type="text"
                    id="coupon-code"
                    placeholder="TICKORA20"
                    {...register('code', { required: 'Code is required' })}
                    className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light uppercase tracking-widest"
                  />
                  {errors.code && <span className="text-[10px] text-red-500">{errors.code.message}</span>}
                </div>

                {/* Discount type */}
                <div className="space-y-1">
                  <label htmlFor="discount-type" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Discount Reduction Type</label>
                  <select
                    id="discount-type"
                    {...register('discountType', { required: 'Discount type is required' })}
                    className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                  >
                    <option value="percentage">Percentage (%) Reduction</option>
                    <option value="fixed">Fixed Reduction Amount (PKR)</option>
                  </select>
                </div>

                {/* Discount amount */}
                <div className="space-y-1">
                  <label htmlFor="discount-amount" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Discount Amount (Value / %)</label>
                  <input
                    type="number"
                    id="discount-amount"
                    placeholder="15"
                    {...register('discountAmount', { required: 'Discount amount is required' })}
                    className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                  />
                  {errors.discountAmount && <span className="text-[10px] text-red-500">{errors.discountAmount.message}</span>}
                </div>

                {/* Min order amount */}
                <div className="space-y-1">
                  <label htmlFor="min-order" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Minimum Order Total (PKR)</label>
                  <input
                    type="number"
                    id="min-order"
                    placeholder="10000"
                    {...register('minOrderAmount')}
                    className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                  />
                </div>

                {/* Max discount amount */}
                <div className="space-y-1">
                  <label htmlFor="max-discount" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Max Discount Cap (For Percentage)</label>
                  <input
                    type="number"
                    id="max-discount"
                    placeholder="3000"
                    {...register('maxDiscountAmount')}
                    className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                  />
                </div>

                {/* Expiry Date */}
                <div className="space-y-1">
                  <label htmlFor="expiry-date" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Expiry Validation Date</label>
                  <input
                    type="date"
                    id="expiry-date"
                    {...register('expiryDate', { required: 'Expiry date is required' })}
                    className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                  />
                  {errors.expiryDate && <span className="text-[10px] text-red-500">{errors.expiryDate.message}</span>}
                </div>

                {/* Usage Limit */}
                <div className="space-y-1">
                  <label htmlFor="usage-limit" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Total Usage Limit (Overall)</label>
                  <input
                    type="number"
                    id="usage-limit"
                    placeholder="50"
                    {...register('usageLimit')}
                    className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                  />
                </div>

                <div className="sm:col-span-2 pt-4 border-t border-white/5 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-gold text-xs px-8"
                  >
                    {submitting ? 'Generating...' : 'Issue Coupon'}
                  </button>
                </div>

              </form>
            </GlassCard>
          )}

          {/* List display */}
          {loading ? (
            <div className="py-12 text-center text-gray-500 font-light text-xs animate-pulse">
              Syncing promotional coupon database...
            </div>
          ) : (
            <GlassCard className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-light">
                  <thead className="bg-[#121212] uppercase text-[10px] tracking-wider text-gray-500 border-b border-white/5">
                    <tr>
                      <th className="p-4 font-semibold">Promo Code</th>
                      <th className="p-4 font-semibold">Reduction rate</th>
                      <th className="p-4 font-semibold">Expiration date</th>
                      <th className="p-4 font-semibold">Usage statistics</th>
                      <th className="p-4 font-semibold">Min Cart</th>
                      <th className="p-4 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {coupons.map((c) => (
                      <tr key={c._id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-mono font-medium text-white tracking-widest uppercase">{c.code}</td>
                        <td className="p-4 uppercase text-gray-400">
                          {c.discountType === 'percentage' ? `${c.discountAmount}%` : `PKR ${c.discountAmount.toLocaleString()}`}
                        </td>
                        <td className="p-4 text-gray-400">
                          {new Date(c.expiryDate).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-gray-400">
                          {c.usedCount} / {c.usageLimit !== null ? c.usageLimit : '∞'}
                        </td>
                        <td className="p-4 text-white font-medium font-poppins">PKR {c.minOrderAmount.toLocaleString()}</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleDeleteCoupon(c._id, c.code)}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                            aria-label="Remove coupon"
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

export default AdminCoupons;
