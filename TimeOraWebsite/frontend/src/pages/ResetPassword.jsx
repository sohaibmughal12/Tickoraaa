import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiLock, FiArrowLeft } from 'react-icons/fi';
import API from '../services/api.js';
import GlassCard from '../components/common/GlassCard.jsx';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post(`/auth/reset-password/${token}`, { password });
      toast.success(res.data.message || 'Password updated! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Password reset failed:', error);
      toast.error(error.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-white flex flex-col justify-center">
      
      {/* Title */}
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-3xl sm:text-4xl font-playfair uppercase tracking-wider text-white">Reset Password</h1>
        <p className="text-xs uppercase tracking-widest text-luxury-gold">Enter new credentials</p>
        <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-2" />
      </div>

      <GlassCard className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* New Password */}
          <div className="space-y-1">
            <label htmlFor="new-password" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">New Password</label>
            <div className="relative">
              <input
                type="password"
                id="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 pl-10 text-xs focus:outline-none text-white font-light"
              />
              <FiLock className="absolute left-3 top-3.5 text-gray-500" size={14} />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label htmlFor="confirm-password" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Confirm Password</label>
            <div className="relative">
              <input
                type="password"
                id="confirm-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 pl-10 text-xs focus:outline-none text-white font-light"
              />
              <FiLock className="absolute left-3 top-3.5 text-gray-500" size={14} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full btn-gold py-3.5 text-xs font-bold disabled:opacity-50"
          >
            {loading ? 'Updating Password...' : 'Save New Password'}
          </button>
        </form>

        <div className="text-center pt-6 border-t border-white/5 mt-6">
          <Link to="/login" className="text-xs text-gray-500 hover:text-white inline-flex items-center gap-1.5 font-light">
            <FiArrowLeft size={14} />
            <span>Cancel</span>
          </Link>
        </div>
      </GlassCard>

    </div>
  );
};

export default ResetPassword;
