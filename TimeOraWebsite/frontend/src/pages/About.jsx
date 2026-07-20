import React from 'react';
import { FiAward, FiShield, FiSliders } from 'react-icons/fi';
import GlassCard from '../components/common/GlassCard.jsx';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white space-y-16">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-playfair uppercase tracking-wider text-white">Our Story</h1>
        <p className="text-xs uppercase tracking-widest text-luxury-gold">The philosophy of Tickora</p>
        <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-2" />
      </div>

      {/* Intro Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 font-light text-sm text-gray-400 leading-relaxed">
          <h2 className="font-playfair text-2xl text-white uppercase tracking-wider">A Tradition of Precision</h2>
          <p>
            Founded in Lahore, Pakistan, Tickora was established to redefine how luxury timepieces are made. By combining classic mechanical geometry with low-key premium aesthetics, we design watches that look stunning, feel incredibly comfortable, and represent structural complexity.
          </p>
          <p>
            We choose to bypass massive retail markups to bring world-class automatic, quartz, and smart hybrid watches to enthusiasts. Every detail – from the polished bezel angle to the thickness of the case profile – is designed in-house.
          </p>
        </div>
        <div className="aspect-[4/3] rounded-lg overflow-hidden border border-white/5 shadow-luxury-soft">
          <img 
            src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=800" 
            alt="Watchmaking detailing" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-white/5 text-center">
        {[
          { icon: FiAward, title: 'Fine Components', text: 'We use surgical 316L stainless steel, anti-reflective sapphire glass, and Japanese/Swiss movement engines.' },
          { icon: FiSliders, title: 'In-House Assembly', text: 'Every timepiece is individualy hand-assembled and calibrated by horologists for precise timing.' },
          { icon: FiShield, title: 'Absolute Testing', text: 'Our watches undergo a rigorous 48-hour pressure and waterproof chamber check before packaging.' }
        ].map((item, idx) => (
          <GlassCard key={idx} className="p-8 space-y-4">
            <item.icon className="text-luxury-gold mx-auto" size={32} />
            <h4 className="font-playfair text-base text-white uppercase tracking-wider font-semibold">{item.title}</h4>
            <p className="text-xs text-gray-500 font-light leading-relaxed">{item.text}</p>
          </GlassCard>
        ))}
      </div>

    </div>
  );
};

export default About;
