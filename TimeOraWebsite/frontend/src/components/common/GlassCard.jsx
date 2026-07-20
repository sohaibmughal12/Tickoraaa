import React from 'react';

const GlassCard = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-glass-gradient border border-white/5 backdrop-blur-md rounded-xl shadow-luxury-soft transition-all duration-300 ${onClick ? 'cursor-pointer hover:border-luxury-gold/20' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;
