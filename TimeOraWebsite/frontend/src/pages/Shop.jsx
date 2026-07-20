import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiGrid, FiList, FiFilter, FiX, FiSearch } from 'react-icons/fi';
import API from '../services/api.js';
import ProductCard from '../components/shop/ProductCard.jsx';
import GlassCard from '../components/common/GlassCard.jsx';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State for products and filtering
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Active filters synced with URL search params
  const searchVal = searchParams.get('search') || '';
  const categoryVal = searchParams.get('category') || '';
  const genderVal = searchParams.get('gender') || '';
  const movementVal = searchParams.get('movement') || '';
  const minPriceVal = searchParams.get('minPrice') || '';
  const maxPriceVal = searchParams.get('maxPrice') || '';
  const sortVal = searchParams.get('sort') || 'newest';

  // Fetch Categories on mount
  useEffect(() => {
    API.get('/categories')
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.error('Failed to fetch categories:', err));
  }, []);

  // Fetch Products whenever filters, sort, or pagination states change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: currentPage,
          limit: viewMode === 'grid' ? 9 : 6,
          search: searchVal,
          category: categoryVal,
          gender: genderVal,
          movement: movementVal,
          minPrice: minPriceVal,
          maxPrice: maxPriceVal,
          sort: sortVal
        });

        const res = await API.get(`/products?${queryParams.toString()}`);
        const { products: fetchedProducts, pages, total } = res.data.data;
        
        setProducts(fetchedProducts);
        setTotalPages(pages);
        setTotalProducts(total);
      } catch (error) {
        console.error('Error fetching filtered products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFilteredProducts();
  }, [searchParams, currentPage, viewMode]);

  // Update query params helper
  const updateQueryParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset to page 1 on filter changes
    newParams.set('page', '1');
    setCurrentPage(1);
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams({ page: '1' }));
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
      
      {/* Banner */}
      <div className="text-center space-y-3 mb-12">
        <h1 className="text-3xl sm:text-5xl font-playfair uppercase tracking-wider text-white">The Collection</h1>
        <p className="text-xs uppercase tracking-widest text-luxury-gold">Precision Engineering meets Minimalist Elegance</p>
        <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-2" />
      </div>

      {/* Control Bar (Grid/List toggle, Search, Sorting) */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-luxury-gray/40 border border-white/5 p-4 rounded-lg mb-8 backdrop-blur-md">
        
        {/* Toggle & Filter Trigger */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center space-x-2 bg-luxury-gold text-luxury-black font-semibold text-xs tracking-wider uppercase px-4 py-2.5 rounded hover:opacity-90"
          >
            <FiFilter size={16} />
            <span>Filters</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors duration-200 ${viewMode === 'grid' ? 'bg-luxury-gold text-luxury-black' : 'text-gray-400 hover:text-white'}`}
              aria-label="Grid View"
            >
              <FiGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors duration-200 ${viewMode === 'list' ? 'bg-luxury-gold text-luxury-black' : 'text-gray-400 hover:text-white'}`}
              aria-label="List View"
            >
              <FiList size={18} />
            </button>
          </div>
          <span className="text-xs text-gray-500 font-light">Showing {products.length} of {totalProducts} timepieces</span>
        </div>

        {/* Searching input bar */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search watches..."
            value={searchVal}
            onChange={(e) => updateQueryParam('search', e.target.value)}
            className="w-full bg-[#121212] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-2.5 pl-10 text-sm focus:outline-none text-white placeholder-gray-600 transition-all duration-300 font-light"
          />
          <FiSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <label htmlFor="sort-select" className="text-xs uppercase tracking-widest text-gray-500 whitespace-nowrap">Sort By:</label>
          <select
            id="sort-select"
            value={sortVal}
            onChange={(e) => updateQueryParam('sort', e.target.value)}
            className="bg-[#121212] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-2.5 text-xs text-white focus:outline-none transition-all duration-300 font-light w-full md:w-auto"
          >
            <option value="newest">Newest Releases</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="best-selling">Best Sellers</option>
          </select>
        </div>
      </div>

      <div className="flex gap-10 items-start">
        
        {/* FILTERS SIDEBAR (DESKTOP) */}
        <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8 bg-luxury-gray/10 border border-white/5 p-6 rounded-lg backdrop-blur-sm sticky top-24">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="font-playfair text-lg text-white uppercase tracking-wider">Filters</h3>
            <button 
              onClick={handleClearFilters}
              className="text-[10px] text-luxury-gold hover:underline uppercase tracking-widest font-semibold"
            >
              Clear All
            </button>
          </div>

          {/* Categories list */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-luxury-gold font-semibold">Category</h4>
            <div className="flex flex-col space-y-2 text-sm font-light text-gray-400">
              <button
                onClick={() => updateQueryParam('category', '')}
                className={`text-left hover:text-white transition-colors ${categoryVal === '' ? 'text-luxury-gold font-medium' : ''}`}
              >
                All Collections
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => updateQueryParam('category', cat.slug)}
                  className={`text-left hover:text-white transition-colors ${categoryVal === cat.slug ? 'text-luxury-gold font-medium' : ''}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Gender Filter */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-luxury-gold font-semibold">Gender</h4>
            <div className="flex flex-col space-y-2 text-sm font-light text-gray-400">
              {['Men', 'Women', 'Unisex'].map((g) => (
                <label key={g} className="flex items-center space-x-2.5 cursor-pointer select-none hover:text-white">
                  <input
                    type="radio"
                    name="gender"
                    checked={genderVal === g}
                    onChange={() => updateQueryParam('gender', g)}
                    className="accent-luxury-gold border-white/10"
                  />
                  <span>{g}</span>
                </label>
              ))}
              <button
                onClick={() => updateQueryParam('gender', '')}
                className="text-left text-xs text-luxury-gold hover:underline font-light pt-1"
              >
                Reset Gender
              </button>
            </div>
          </div>

          {/* Movement Filter */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-luxury-gold font-semibold">Movement</h4>
            <div className="flex flex-col space-y-2 text-sm font-light text-gray-400">
              {['Automatic', 'Quartz', 'Smart'].map((m) => (
                <label key={m} className="flex items-center space-x-2.5 cursor-pointer select-none hover:text-white">
                  <input
                    type="radio"
                    name="movement"
                    checked={movementVal === m}
                    onChange={() => updateQueryParam('movement', m)}
                    className="accent-luxury-gold border-white/10"
                  />
                  <span>{m}</span>
                </label>
              ))}
              <button
                onClick={() => updateQueryParam('movement', '')}
                className="text-left text-xs text-luxury-gold hover:underline font-light pt-1"
              >
                Reset Movement
              </button>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-luxury-gold font-semibold">Price Range (PKR)</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-light">
              <input
                type="number"
                placeholder="Min"
                value={minPriceVal}
                onChange={(e) => updateQueryParam('minPrice', e.target.value)}
                className="bg-[#121212] border border-white/5 rounded p-2 focus:outline-none focus:border-luxury-gold/50 text-white text-center"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPriceVal}
                onChange={(e) => updateQueryParam('maxPrice', e.target.value)}
                className="bg-[#121212] border border-white/5 rounded p-2 focus:outline-none focus:border-luxury-gold/50 text-white text-center"
              />
            </div>
          </div>
        </aside>

        {/* PRODUCTS WORKSPACE */}
        <div className="flex-grow">
          {loading ? (
            <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-luxury-gray animate-pulse-slow rounded border border-white/5" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-6">
                  {products.map((product) => (
                    <div 
                      key={product._id} 
                      className="group flex flex-col sm:flex-row bg-[#121212]/40 border border-white/5 hover:border-luxury-gold/30 rounded-lg overflow-hidden transition-all duration-300 shadow-luxury-soft"
                    >
                      <div className="relative w-full sm:w-52 md:w-64 aspect-square bg-[#161616] overflow-hidden flex-shrink-0">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6 flex flex-col justify-between flex-grow">
                        <div className="space-y-2">
                          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">{product.category?.name}</span>
                          <h3 className="font-playfair text-xl text-white group-hover:text-luxury-gold transition-colors duration-200">{product.name}</h3>
                          <p className="text-xs text-gray-400 font-light leading-relaxed line-clamp-3 md:line-clamp-4">{product.description}</p>
                        </div>
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                          <span className="text-sm font-semibold text-luxury-gold font-poppins">
                            PKR {product.discountPrice ? product.discountPrice.toLocaleString() : product.price.toLocaleString()}
                          </span>
                          <Link 
                            to={`/products/${product.slug}`}
                            className="text-xs text-white hover:text-luxury-gold border border-white/10 hover:border-luxury-gold px-4 py-2 rounded transition-all duration-300 uppercase tracking-widest font-semibold"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination indicators */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center space-x-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-4 py-2 bg-luxury-gray/40 border border-white/5 text-xs text-gray-300 hover:text-white rounded disabled:opacity-50 transition-colors duration-200"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-9 h-9 flex items-center justify-center border text-xs rounded transition-colors duration-200 ${
                        currentPage === i + 1
                          ? 'bg-luxury-gold border-luxury-gold text-luxury-black font-semibold'
                          : 'bg-luxury-gray/20 border-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-4 py-2 bg-luxury-gray/40 border border-white/5 text-xs text-gray-300 hover:text-white rounded disabled:opacity-50 transition-colors duration-200"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-24 bg-[#121212]/10 border border-white/5 rounded-lg">
              <h3 className="font-playfair text-xl text-white mb-2">No watches match your criteria</h3>
              <p className="text-sm text-gray-500 font-light">Try expanding your filters or search options.</p>
              <button 
                onClick={handleClearFilters}
                className="mt-6 btn-gold text-xs"
              >
                View All Timepieces
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTERS SIDEBAR OVERLAY */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-luxury-black/98 backdrop-blur-md p-6 overflow-y-auto flex flex-col">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
            <h3 className="font-playfair text-xl text-white uppercase tracking-wider">Filters</h3>
            <button 
              onClick={() => setShowMobileFilters(false)}
              className="text-white hover:text-luxury-gold focus:outline-none"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="space-y-8 flex-grow">
            {/* Category */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest text-luxury-gold font-semibold">Category</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { updateQueryParam('category', ''); setShowMobileFilters(false); }}
                  className={`text-xs px-3 py-2 border rounded ${categoryVal === '' ? 'bg-luxury-gold text-luxury-black border-luxury-gold font-semibold' : 'bg-[#121212] border-white/5 text-gray-400'}`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => { updateQueryParam('category', cat.slug); setShowMobileFilters(false); }}
                    className={`text-xs px-3 py-2 border rounded ${categoryVal === cat.slug ? 'bg-luxury-gold text-luxury-black border-luxury-gold font-semibold' : 'bg-[#121212] border-white/5 text-gray-400'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest text-luxury-gold font-semibold">Gender</h4>
              <div className="flex gap-2">
                {['Men', 'Women', 'Unisex'].map((g) => (
                  <button
                    key={g}
                    onClick={() => { updateQueryParam('gender', g); setShowMobileFilters(false); }}
                    className={`text-xs px-3 py-2 border rounded ${genderVal === g ? 'bg-luxury-gold text-luxury-black border-luxury-gold font-semibold' : 'bg-[#121212] border-white/5 text-gray-400'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Movement */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest text-luxury-gold font-semibold">Movement</h4>
              <div className="flex gap-2">
                {['Automatic', 'Quartz', 'Smart'].map((m) => (
                  <button
                    key={m}
                    onClick={() => { updateQueryParam('movement', m); setShowMobileFilters(false); }}
                    className={`text-xs px-3 py-2 border rounded ${movementVal === m ? 'bg-luxury-gold text-luxury-black border-luxury-gold font-semibold' : 'bg-[#121212] border-white/5 text-gray-400'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Inputs */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest text-luxury-gold font-semibold">Price Range (PKR)</h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={minPriceVal}
                  onChange={(e) => updateQueryParam('minPrice', e.target.value)}
                  className="bg-[#121212] border border-white/5 rounded p-3 text-sm focus:outline-none focus:border-luxury-gold/50 text-white text-center"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={maxPriceVal}
                  onChange={(e) => updateQueryParam('maxPrice', e.target.value)}
                  className="bg-[#121212] border border-white/5 rounded p-3 text-sm focus:outline-none focus:border-luxury-gold/50 text-white text-center"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/5 flex gap-4">
            <button
              onClick={() => { handleClearFilters(); setShowMobileFilters(false); }}
              className="w-1/2 border border-white/10 hover:border-luxury-gold text-white px-4 py-3 rounded text-xs uppercase tracking-widest font-semibold transition-colors duration-200"
            >
              Clear All
            </button>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-1/2 bg-luxury-gold text-luxury-black px-4 py-3 rounded text-xs uppercase tracking-widest font-bold transition-all duration-200"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Shop;
