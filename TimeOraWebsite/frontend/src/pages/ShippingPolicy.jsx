import React from 'react';
import GlassCard from '../components/common/GlassCard.jsx';

const ShippingPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-white space-y-8 leading-relaxed font-light">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-playfair uppercase tracking-wider text-white">Shipping Policy</h1>
        <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-2" />
      </div>

      <GlassCard className="p-8 space-y-6 text-sm text-gray-300">
        <section className="space-y-2">
          <h2 className="font-playfair text-lg text-white uppercase tracking-wider">1. Delivery Zones & Coverages</h2>
          <p>We deliver nationwide across all major cities and territories in Pakistan. All orders are packed securely in damage-proof premium branding boxes to guarantee your timepiece arrives in pristine condition.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-playfair text-lg text-white uppercase tracking-wider">2. Shipping Tariffs & Free Delivery</h2>
          <p>We charge a flat rate of PKR 250 for orders below PKR 20,000. All orders valued at PKR 20,000 and above qualify for free standard delivery.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-playfair text-lg text-white uppercase tracking-wider">3. Dispatch & Arrival Timelines</h2>
          <p>Orders placed before 3:00 PM are processed and handed over to our courier partners (TCS, Leopard, PostEx) on the same working day. Expected delivery timelines are:</p>
          <ul className="list-disc pl-5 space-y-1 mt-1 text-xs">
            <li>Lahore: 1 - 2 working days.</li>
            <li>Karachi, Islamabad, Rawalpindi: 2 - 3 working days.</li>
            <li>Other cities: 3 - 4 working days.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-playfair text-lg text-white uppercase tracking-wider">4. Tracking & Delivery Adjustments</h2>
          <p>Upon order dispatch, you will receive an automatic email and SMS containing your courier tracking number. Cash on Delivery orders require mobile phone confirmation before dispatch.</p>
        </section>
      </GlassCard>
    </div>
  );
};

export default ShippingPolicy;
