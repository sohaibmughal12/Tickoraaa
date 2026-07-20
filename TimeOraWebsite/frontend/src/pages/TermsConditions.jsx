import React from 'react';
import GlassCard from '../components/common/GlassCard.jsx';

const TermsConditions = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-white space-y-8 leading-relaxed font-light">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-playfair uppercase tracking-wider text-white">Terms & Conditions</h1>
        <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-2" />
      </div>

      <GlassCard className="p-8 space-y-6 text-sm text-gray-300">
        <section className="space-y-2">
          <h2 className="font-playfair text-lg text-white uppercase tracking-wider">1. Agreement of Purchase</h2>
          <p>By placing an order on the Tickora website, you agree to buy the specified timepieces in accordance with our terms of service, pricing, and shipping policies. All order requests are subject to verification and approval.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-playfair text-lg text-white uppercase tracking-wider">2. Pricing & Currency</h2>
          <p>All prices listed on the website are in Pakistani Rupees (PKR) and are inclusive of standard local taxes. We reserve the right to alter pricing, release updates, or withdraw promotions without prior warning.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-playfair text-lg text-white uppercase tracking-wider">3. Intellectual Property Rights</h2>
          <p>The brand name 'Tickora', website layout animations, original watch illustrations, logos, copy text, and structural watch configurations are proprietary property of Tickora. Unauthorized reproduction of content is strictly prohibited.</p>
        </section>
      </GlassCard>
    </div>
  );
};

export default TermsConditions;
