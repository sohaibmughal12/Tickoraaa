import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import API from '../services/api.js';
import GlassCard from '../components/common/GlassCard.jsx';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetTokenInfo, setResetTokenInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await API.post('/auth/forgot-password', { email });
      toast.success('Password reset token generated!');
      setResetTokenInfo(res.data.data.resetToken);
    } catch (error) {
      console.error('Password recovery request failed:', error);
      toast.error(error.response?.data?.message || 'Failed to submit request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-white flex flex-col justify-center">
      
      {/* Title */}
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-3xl sm:text-4xl font-playfair uppercase tracking-wider text-white">Forgot Password</h1>
        <p className="text-xs uppercase tracking-widest text-luxury-gold">Recover account credentials</p>
        <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-2" />
      </div>

      <GlassCard className="p-8 space-y-6">
        {resetTokenInfo ? (
          <div className="space-y-6 text-center">
            <div className="bg-luxury-gold/5 border border-luxury-gold/25 p-4 rounded text-xs leading-relaxed text-gray-300 font-light space-y-2">
              <h4 className="font-poppins uppercase tracking-widest text-luxury-gold font-bold">Developer Helper Notice</h4>
              <p>Since email transport isn't configured, your password reset token is shown here:</p>
              <span className="block bg-black p-2 font-mono text-white select-all text-center rounded text-sm tracking-wider font-semibold">
                {resetTokenInfo}
              </span>
            </div>
            
            <p className="text-xs text-gray-400 font-light">
              Copy this token and click below to enter your new password.
            </p>

            <Link 
              to={`/reset-password/${resetTokenInfo}`} 
              className="w-full btn-gold py-3.5 text-xs font-bold block text-center"
            >
              Reset Password Now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              Enter your email address below. We will send you instructions (or a developer token) to securely reset your account password.
            </p>

            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  placeholder="sohaib@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 pl-10 text-xs focus:outline-none text-white font-light"
                />
                <FiMail className="absolute left-3 top-3.5 text-gray-500" size={14} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full btn-gold py-3.5 text-xs font-bold disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <Link to="/login" className="text-xs text-gray-500 hover:text-white inline-flex items-center gap-1.5 font-light">
            <FiArrowLeft size={14} />
            <span>Back to Login</span>
          </Link>
        </div>
      </GlassCard>

    </div>
  );
};

export default ForgotPassword;
