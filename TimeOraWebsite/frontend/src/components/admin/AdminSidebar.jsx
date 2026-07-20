import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiTrendingUp, FiShoppingBag, FiLayers, FiTag, FiStar, FiArrowLeft } from 'react-icons/fi';
import GlassCard from '../common/GlassCard.jsx';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: FiTrendingUp },
    { name: 'Products', path: '/admin/products', icon: FiLayers },
    { name: 'Orders', path: '/admin/orders', icon: FiShoppingBag },
    { name: 'Coupons', path: '/admin/coupons', icon: FiTag },
    { name: 'Reviews', path: '/admin/reviews', icon: FiStar },
  ];

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <GlassCard className="p-5 flex flex-col space-y-4">
        <div className="border-b border-white/5 pb-4 text-center sm:text-left">
          <h4 className="font-playfair text-base uppercase text-luxury-gold tracking-widest font-black">
            Atelier Manager
          </h4>
          <span className="text-[10px] text-gray-500 font-light uppercase tracking-wider block mt-0.5">Control Center</span>
        </div>

        {/* Sidebar link navigation list */}
        <nav className="flex flex-col space-y-1.5">
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={idx}
                to={item.path}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  isActive 
                    ? 'bg-luxury-gold text-luxury-black shadow-gold-glow' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={16} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick escape link */}
        <div className="border-t border-white/5 pt-4">
          <Link
            to="/profile"
            className="w-full flex items-center justify-center space-x-2 text-xs text-gray-500 hover:text-white uppercase tracking-widest py-2 hover:bg-white/5 rounded transition-all duration-150"
          >
            <FiArrowLeft size={14} />
            <span>Store Dashboard</span>
          </Link>
        </div>
      </GlassCard>
    </aside>
  );
};

export default AdminSidebar;
