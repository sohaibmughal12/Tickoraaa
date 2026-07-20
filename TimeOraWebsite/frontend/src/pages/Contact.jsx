import React from 'react';
import { FiMail, FiMapPin, FiPhone, FiMessageCircle } from 'react-icons/fi';
import GlassCard from '../components/common/GlassCard.jsx';
import toast from 'react-hot-toast';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Thank you for contacting Tickora. Our concierge team will reach out shortly!');
    e.target.reset();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white space-y-16">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-playfair uppercase tracking-wider text-white">Contact Us</h1>
        <p className="text-xs uppercase tracking-widest text-luxury-gold">Connect with our concierge</p>
        <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Contact details */}
        <div className="space-y-8 leading-relaxed font-light">
          <div className="space-y-4">
            <h2 className="font-playfair text-2xl text-white uppercase tracking-wider">Tickora Headquarters</h2>
            <p className="text-xs text-gray-500">
              For corporate reviews, press relationships, or personal boutique fittings, please visit our Lahore branch.
            </p>
          </div>

          <div className="space-y-6 text-sm text-gray-300">
            <div className="flex items-start space-x-3.5">
              <FiMapPin className="text-luxury-gold mt-1 flex-shrink-0" size={18} />
              <div>
                <h4 className="font-poppins text-xs font-semibold uppercase text-white tracking-widest mb-0.5">Gulberg Boutique</h4>
                <p>M-45 Boulevard Phase, Gulberg III, Lahore, Pakistan</p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <FiPhone className="text-luxury-gold mt-1 flex-shrink-0" size={18} />
              <div>
                <h4 className="font-poppins text-xs font-semibold uppercase text-white tracking-widest mb-0.5">Concierge Phone</h4>
                <p>+92 300 123 4567 (Mon-Sat, 10am-7pm)</p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <FiMail className="text-luxury-gold mt-1 flex-shrink-0" size={18} />
              <div>
                <h4 className="font-poppins text-xs font-semibold uppercase text-white tracking-widest mb-0.5">Client Support Email</h4>
                <p>support@tickora.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messaging form card */}
        <GlassCard className="p-8">
          <h3 className="font-playfair text-lg text-white uppercase tracking-wider mb-6 flex items-center gap-2">
            <FiMessageCircle className="text-luxury-gold" />
            <span>Leave a Message</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="contact-name" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Your Name</label>
              <input
                type="text"
                id="contact-name"
                required
                className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="contact-email" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Email Address</label>
              <input
                type="email"
                id="contact-email"
                required
                className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="contact-msg" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Message Body</label>
              <textarea
                id="contact-msg"
                rows="4"
                required
                placeholder="Write your request, fitting details, or inquiry here..."
                className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded p-3 text-xs focus:outline-none text-white font-light resize-none leading-relaxed"
              />
            </div>

            <button type="submit" className="w-full btn-gold py-3.5 text-xs font-bold">
              Submit Message
            </button>
          </form>
        </GlassCard>

      </div>

    </div>
  );
};

export default Contact;
