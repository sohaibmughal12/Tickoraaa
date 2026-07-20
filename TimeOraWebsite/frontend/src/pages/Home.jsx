import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiShield, FiRotateCcw, FiAward, FiStar } from 'react-icons/fi';
import API from '../services/api.js';
import ProductCard from '../components/shop/ProductCard.jsx';
import CountdownTimer from '../components/common/CountdownTimer.jsx';
import GlassCard from '../components/common/GlassCard.jsx';

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600',
    subtitle: 'The Mechanical Masterpiece',
    title: 'THE AUTOMATIC SKELETON',
    desc: 'Uncompromising engineering. Exposed 316L steel gears with sapphire crystal case backing.',
    link: '/shop?category=automatic'
  },
  {
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1600',
    subtitle: 'Chronograph Precision',
    title: 'THE CHRONO GOLD ELITE',
    desc: 'Polished 18k gold plating combined with dual-register stopwatch dials for the high-achiever.',
    link: '/shop?category=chronograph'
  },
  {
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1600',
    subtitle: 'Minimalism Reimagined',
    title: 'THE HORIZON HYBRID',
    desc: 'Timeless luxury aesthetics on the outside. Connected smart OLED display on the inside.',
    link: '/shop?category=smart-hybrid'
  }
];

const testimonials = [
  {
    name: 'Sardar Ali',
    role: 'Verified Buyer',
    text: 'The Legacy Skeleton automatic watch is a piece of art. People notice the open gears instantly. Shipping to Islamabad took only two days.',
    rating: 5
  },
  {
    name: 'Ayesha Omer',
    role: 'Luxury Connoisseur',
    text: 'Tickora watches look and feel like premium timepieces that cost five times as much. The Rose Gold finish is outstanding.',
    rating: 5
  },
  {
    name: 'Bilal Siddiqui',
    role: 'Verified Buyer',
    text: 'Excellent customer service. I had a size adjustment question for the mesh strap, and they walked me through it on WhatsApp.',
    rating: 5
  }
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Future-proof Target date for flash sale (7 days from now)
  const [flashSaleEnd] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

  // Autoplay hero slide show
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Fetch products and categories on component mounting
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          API.get('/categories'),
          API.get('/products?limit=6')
        ]);

        setCategories(catRes.data.data);
        
        const allProducts = prodRes.data.data.products;
        // Filter out featured and new arrivals
        setFeaturedProducts(allProducts.filter(p => p.isFeatured).slice(0, 3));
        setNewArrivals(allProducts.slice(0, 3));
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="w-full text-white">
      
      {/* 1. HERO SECTION WITH CAROUSEL */}
      <section className="relative h-[85vh] sm:h-[90vh] bg-black overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
            <img
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
              className="w-full h-full object-cover opacity-60"
            />
            
            <div className="absolute inset-0 z-20 flex items-center justify-start max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-xl text-left space-y-4">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xs sm:text-sm uppercase tracking-widest text-luxury-gold font-semibold font-poppins block"
                >
                  {heroSlides[currentSlide].subtitle}
                </motion.span>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl sm:text-5xl lg:text-6xl font-black font-playfair uppercase text-white tracking-wider leading-tight"
                >
                  {heroSlides[currentSlide].title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-sm sm:text-base text-gray-300 leading-relaxed font-light font-poppins"
                >
                  {heroSlides[currentSlide].desc}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="pt-4"
                >
                  <Link to={heroSlides[currentSlide].link} className="btn-gold flex items-center w-fit space-x-2">
                    <span>Discover Collection</span>
                    <FiArrowRight />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Hero Slider Dots indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'bg-luxury-gold w-8' : 'bg-white/30'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Brand Value Pillars */}
      <section className="bg-luxury-gray py-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: FiAward, title: 'Premium Craftsmanship', desc: 'Hand-selected materials, Japanese movements, sapphire crystal glass.' },
            { icon: FiShield, title: '2-Year Warranty', desc: 'Every watch is backed by a 2-year warranty for absolute peace of mind.' },
            { icon: FiRotateCcw, title: 'Easy Returns', desc: 'Enjoy hassle-free returns and exchanges within 14 days of receipt.' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-start space-x-4 border-r border-white/5 last:border-r-0 pr-4">
              <item.icon className="text-luxury-gold flex-shrink-0 mt-1" size={24} />
              <div>
                <h4 className="font-poppins text-sm uppercase tracking-wider text-white font-medium mb-1">{item.title}</h4>
                <p className="text-xs text-gray-500 font-light leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. CATEGORIES GRID */}
      <section className="py-24 bg-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs uppercase tracking-widest text-luxury-gold font-semibold font-poppins">Curated Collections</span>
            <h2 className="text-3xl sm:text-4xl font-playfair uppercase text-white tracking-wider">Browse by Category</h2>
            <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.length > 0 ? (
              categories.map((cat, index) => (
                <Link
                  key={cat._id}
                  to={`/shop?category=${cat.slug}`}
                  className="group relative h-[380px] bg-luxury-gray rounded-lg overflow-hidden border border-white/5 hover:border-luxury-gold/30 transition-all duration-500 shadow-luxury-soft"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent z-10" />
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400'}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-6 left-6 right-6 z-20 space-y-2">
                    <h3 className="font-playfair text-xl text-white uppercase tracking-wider group-hover:text-luxury-gold transition-colors duration-200">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-light leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                    <span className="inline-flex items-center text-[10px] text-luxury-gold uppercase tracking-widest font-semibold pt-2">
                      View Collection <FiArrowRight className="ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-[380px] bg-[#1a1a1a] rounded animate-pulse-slow border border-white/5" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* 3. FEATURED COLLECTION SECTION */}
      <section className="py-24 bg-luxury-black/95 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-16">
            <div className="text-center sm:text-left space-y-2 mb-4 sm:mb-0">
              <span className="text-xs uppercase tracking-widest text-luxury-gold font-semibold font-poppins">Signature Models</span>
              <h2 className="text-3xl sm:text-4xl font-playfair uppercase text-white tracking-wider">Featured Timepieces</h2>
            </div>
            <Link to="/shop" className="btn-outline-gold flex items-center space-x-2 text-xs">
              <span>View All Products</span>
              <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-luxury-gray animate-pulse-slow rounded border border-white/5" />
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p className="text-gray-400 text-sm col-span-3 text-center py-10">No featured products loaded yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* 4. LIMITED EDITION FLASH BANNER WITH TIMER */}
      <section className="relative py-28 overflow-hidden bg-black border-t border-b border-white/5">
        <div className="absolute inset-0 bg-cover bg-center opacity-40 bg-[url('https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1600')]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent z-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <span className="bg-luxury-gold text-luxury-black text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-sm inline-block">
              Exclusive Flash Release
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-playfair uppercase tracking-wider text-white">
              Tickora Legacy Skeleton
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-light">
              Only 12 timepieces remaining worldwide. Impeccable exposed self-winding movement, 42mm high-gloss finish steel bezel, and premium black crocodile leather strap. Includes dynamic collectors case and authenticity credentials.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <div className="text-2xl font-black text-luxury-gold">PKR 39,500 <span className="text-sm font-light text-gray-500 line-through">PKR 45,000</span></div>
              <Link to="/products/tickora-legacy-skeleton" className="btn-gold px-8 text-xs">
                Buy Now
              </Link>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center space-y-6">
            <h4 className="font-playfair text-lg text-white uppercase tracking-widest">Pricing Expires In</h4>
            <CountdownTimer targetDate={flashSaleEnd} />
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS */}
      <section className="py-24 bg-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs uppercase tracking-widest text-luxury-gold font-semibold font-poppins">Fresh From The Atelier</span>
            <h2 className="text-3xl sm:text-4xl font-playfair uppercase text-white tracking-wider">New Arrivals</h2>
            <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-luxury-gray animate-pulse-slow rounded border border-white/5" />
              ))
            ) : newArrivals.length > 0 ? (
              newArrivals.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p className="text-gray-400 text-sm col-span-3 text-center py-10">No new arrivals loaded.</p>
            )}
          </div>
        </div>
      </section>

      {/* 6. ABOUT SECTION */}
      <section className="py-28 bg-[#090909] border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-video lg:aspect-[4/3] rounded-lg overflow-hidden border border-white/5 shadow-luxury-soft">
            <div className="absolute inset-0 bg-black/20 z-10" />
            <img
              src="https://images.unsplash.com/photo-1539874754764-5a96559165b0?q=80&w=800"
              alt="Crafting watch details"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-luxury-gold font-semibold font-poppins">Our Heritage</span>
            <h2 className="text-3xl sm:text-4xl font-playfair uppercase tracking-wider text-white">
              The Art of Absolute Timing
            </h2>
            <p className="text-gray-400 text-sm font-light leading-relaxed">
              Founded on the belief that a watch is not just a tool for measuring time, but a personal statement of legacy and aesthetics. Each Tickora watch is assembled by hand by expert horologists using hand-finished components, Swiss or Japanese movements, and sapphire coatings.
            </p>
            <p className="text-gray-400 text-sm font-light leading-relaxed">
              We focus on structural geometry, premium textures, and clean minimalist dials. Our signature models showcase the internal mechanical movement, turning structural engineering into wearable jewelry.
            </p>
            <div className="pt-4">
              <Link to="/about" className="btn-outline-gold px-8 py-3 text-xs inline-flex items-center space-x-2">
                <span>Discover Our Story</span>
                <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="py-24 bg-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-3 mb-16">
            <span className="text-xs uppercase tracking-widest text-luxury-gold font-semibold font-poppins">Owner Reviews</span>
            <h2 className="text-3xl sm:text-4xl font-playfair uppercase text-white tracking-wider">Tickora Testimonials</h2>
            <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((item, idx) => (
              <GlassCard key={idx} className="p-8 flex flex-col items-center justify-between text-center relative h-full">
                <div className="space-y-4">
                  {/* Testimonial Stars */}
                  <div className="flex text-luxury-gold space-x-1 justify-center">
                    {[...Array(item.rating)].map((_, i) => (
                      <FiStar key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-sm italic text-gray-300 font-light leading-relaxed">
                    "{item.text}"
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-white/5 w-full">
                  <h4 className="font-poppins text-xs font-semibold uppercase text-white tracking-wider">{item.name}</h4>
                  <span className="text-[10px] text-luxury-gold uppercase tracking-widest font-light">{item.role}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* 8. INSTAGRAM FEED */}
      <section className="py-20 bg-luxury-black/95 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-luxury-gold font-semibold font-poppins">Follow our Journal</span>
            <h2 className="text-2xl sm:text-3xl font-playfair uppercase text-white tracking-wider">#TickoraTime</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=400',
              'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=400',
              'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400',
              'https://images.unsplash.com/photo-1539874754764-5a96559165b0?q=80&w=400'
            ].map((img, idx) => (
              <div key={idx} className="group relative aspect-square bg-luxury-gray rounded overflow-hidden border border-white/5">
                <img
                  src={img}
                  alt={`Instagram highlight ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-xs text-white tracking-widest font-semibold">View Post</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
