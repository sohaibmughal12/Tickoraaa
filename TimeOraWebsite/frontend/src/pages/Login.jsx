import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiMail, FiLock, FiLogOut } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext.jsx';
import GlassCard from '../components/common/GlassCard.jsx';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const redirectPath = location.state?.from?.pathname || (user.role === 'admin' ? '/admin' : '/profile');
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate, location]);

  const onSubmit = async (data) => {
    setLoading(true);
    const res = await login(data.email, data.password);
    setLoading(false);

    if (res.success) {
      toast.success('Welcome back to Tickora!');
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-white flex flex-col justify-center">
      
      {/* Title */}
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-3xl sm:text-4xl font-playfair uppercase tracking-wider text-white">Login</h1>
        <p className="text-xs uppercase tracking-widest text-luxury-gold">Access your luxury dashboard</p>
        <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-2" />
      </div>

      <GlassCard className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Email input */}
          <div className="space-y-1">
            <label htmlFor="email" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Email Address</label>
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder="sohaib@example.com"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Please enter a valid email address' }
                })}
                className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 pl-10 text-xs focus:outline-none text-white font-light"
              />
              <FiMail className="absolute left-3 top-3.5 text-gray-500" size={14} />
            </div>
            {errors.email && <span className="text-[10px] text-red-500">{errors.email.message}</span>}
          </div>

          {/* Password input */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Password</label>
              <Link to="/forgot-password" className="text-[10px] text-luxury-gold hover:underline uppercase tracking-widest">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                {...register('password', { required: 'Password is required' })}
                className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 pl-10 text-xs focus:outline-none text-white font-light"
              />
              <FiLock className="absolute left-3 top-3.5 text-gray-500" size={14} />
            </div>
            {errors.password && <span className="text-[10px] text-red-500">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-3.5 text-xs font-bold disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-500 font-light pt-6 border-t border-white/5">
          <span>Don't have a private account? </span>
          <Link to="/signup" className="text-luxury-gold hover:underline font-semibold uppercase tracking-widest text-[10px] ml-1">
            Sign Up
          </Link>
        </div>
      </GlassCard>

    </div>
  );
};

export default Login;
