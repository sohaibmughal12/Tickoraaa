import React from 'react';
import GlassCard from '../components/common/GlassCard.jsx';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-white space-y-8 leading-relaxed font-light">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-playfair uppercase tracking-wider text-white">Privacy Policy</h1>
        <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-2" />
      </div>

      <GlassCard className="p-8 space-y-6 text-sm text-gray-300">
        <section className="space-y-2">
          <h2 className="font-playfair text-lg text-white uppercase tracking-wider">1. Data Capture Protocols</h2>
          <p>We respect your privacy. We collect personal details you provide during registration, checkout, and newsletter subscription, including name, email address, delivery address, phone number, and billing information.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-playfair text-lg text-white uppercase tracking-wider">2. Use of Information</h2>
          <p>Captured information is used to process checkouts, arrange delivery via partner couriers, verify payments, prevent transaction fraud, and send newsletter updates.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-playfair text-lg text-white uppercase tracking-wider">3. Security Controls & Data Protection</h2>
          <p>We implement Secure Sockets Layer (SSL) encryption for all transactions. Address data and session tokens are protected using standard database permissions and security firewalls. Tickora does not sell or lease client information to third-party marketing organizations.</p>
        </section>
      </GlassCard>
    </div>
  );
};

export default PrivacyPolicy;
