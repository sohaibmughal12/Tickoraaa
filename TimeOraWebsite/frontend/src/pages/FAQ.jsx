import React, { useState } from 'react';
import GlassCard from '../components/common/GlassCard.jsx';

const faqs = [
  {
    q: 'How long does shipping take in Pakistan?',
    a: 'We deliver nationwide within 2 to 4 working days. Delivery within Lahore takes 1-2 working days. We offer free shipping on all orders above PKR 20,000.'
  },
  {
    q: 'What warranty is provided with Tickora watches?',
    a: 'Every Tickora timepiece is backed by a comprehensive 2-Year International Warranty that covers manufacturing defects in the movement engine. Straps and crystal glass damages resulting from natural wear and tear are excluded.'
  },
  {
    q: 'Can I adjust the stainless steel mesh straps myself?',
    a: 'Yes, our mesh straps are fully adjustable without specialized tools. A simple adjustment latch on the clasp can be slid up or down the band to customize the fitting. We include a visual setup guide in the watch packaging box.'
  },
  {
    q: 'What local payment options are supported?',
    a: 'We support Cash on Delivery (COD), JazzCash, Easypaisa, direct Bank Transfer, and secure online credit card payments via Stripe. Choose your preferred checkout payment method during checkout.'
  },
  {
    q: 'Are Tickora watches waterproof?',
    a: 'Our Automatic watches are water-resistant up to 5 ATM (50 meters), and our Minimalist series are water-resistant up to 3 ATM (30 meters). They can handle splash contact, rain, and hand washing, but we advise against swimming or diving wearing leather straps.'
  }
];

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const toggleOpen = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-white space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-playfair uppercase tracking-wider text-white">Frequently Asked Questions</h1>
        <p className="text-xs uppercase tracking-widest text-luxury-gold">Answers to common customer inquiries</p>
        <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-2" />
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <GlassCard key={idx} className="overflow-hidden">
            <button
              onClick={() => toggleOpen(idx)}
              className="w-full p-6 text-left focus:outline-none flex justify-between items-center transition-colors duration-200 hover:text-luxury-gold"
            >
              <span className="font-playfair text-base uppercase tracking-wider">{faq.q}</span>
              <span className="text-luxury-gold text-xl font-bold">{openIdx === idx ? '−' : '+'}</span>
            </button>
            
            {openIdx === idx && (
              <div className="px-6 pb-6 text-xs text-gray-400 font-light leading-relaxed border-t border-white/5 pt-4">
                {faq.a}
              </div>
            )}
          </GlassCard>
        ))}
      </div>

    </div>
  );
};

export default FAQ;
