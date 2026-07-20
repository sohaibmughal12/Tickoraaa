import React from 'react';
import GlassCard from '../components/common/GlassCard.jsx';

const ReturnPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-white space-y-8 leading-relaxed font-light">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-playfair uppercase tracking-wider text-white">Return & Exchange Policy</h1>
        <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-2" />
      </div>

      <GlassCard className="p-8 space-y-6 text-sm text-gray-300">
        <section className="space-y-2">
          <h2 className="font-playfair text-lg text-white uppercase tracking-wider">1. Return Window</h2>
          <p>We stand behind our luxury craftsmanship. If you are not fully satisfied with your timepiece, you may request a return or exchange within 14 days of order delivery.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-playfair text-lg text-white uppercase tracking-wider">2. Return Eligibility & Conditions</h2>
          <p>To qualify for a refund or size replacement, the item must meet the following criteria:</p>
          <ul className="list-disc pl-5 space-y-1 mt-1 text-xs">
            <li>The watch must be unworn, unscratched, and unaltered.</li>
            <li>All protective plastic wraps on the dial and case back must be intact.</li>
            <li>The item must be in its original premium leather case, including outer sleeves, instructions booklet, and warranty credentials.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-playfair text-lg text-white uppercase tracking-wider">3. Non-Returnable Items</h2>
          <p>Timepieces custom engraved, final sale items, or watches altered by third-party jewelers are non-returnable.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-playfair text-lg text-white uppercase tracking-wider">4. Return Methods & Refunds</h2>
          <p>To initiate a return, contact our support team at <span className="text-white">returns@tickora.com</span> with your Order ID. You will be asked to ship the box to our Lahore warehouse. Upon quality inspection, refunds are processed via bank transfer or wallet payments within 5-7 business days.</p>
        </section>
      </GlassCard>
    </div>
  );
};

export default ReturnPolicy;
