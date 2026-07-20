import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiTrash2, FiEdit, FiX, FiLayers } from 'react-icons/fi';
import API from '../services/api.js';
import AdminSidebar from '../components/admin/AdminSidebar.jsx';
import GlassCard from '../components/common/GlassCard.jsx';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form handling state
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null); // Product object to edit, otherwise null for adding

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Load products and categories list
  const fetchProductsList = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        API.get('/products?limit=100'),
        API.get('/categories')
      ]);
      setProducts(prodRes.data.data.products);
      setCategories(catRes.data.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to sync products database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsList();
  }, []);

  // Set values for edit
  const handleEditClick = (product) => {
    setEditProduct(product);
    setShowForm(true);
    
    // Populate form inputs
    setValue('name', product.name);
    setValue('sku', product.sku);
    setValue('price', product.price);
    setValue('discountPrice', product.discountPrice || '');
    setValue('category', product.category?._id || '');
    setValue('stock', product.stock);
    setValue('gender', product.gender);
    setValue('movement', product.movement);
    setValue('dialColor', product.dialColor);
    setValue('description', product.description);
    setValue('images', product.images.join(', '));
  };

  // Reset form
  const handleCloseForm = () => {
    reset();
    setEditProduct(null);
    setShowForm(false);
  };

  // Submit add or edit
  const onProductSubmit = async (data) => {
    const payload = {
      ...data,
      price: Number(data.price),
      discountPrice: data.discountPrice ? Number(data.discountPrice) : undefined,
      stock: Number(data.stock),
      images: data.images.split(',').map(img => img.trim()).filter(Boolean),
      // Dummy variants/specs structure for luxurious feel
      variants: [
        { color: data.dialColor, strapMaterial: 'Oyster Stainless Mesh', stock: Number(data.stock) }
      ],
      specifications: [
        { label: 'Movement', value: data.movement },
        { label: 'Case Material', value: '316L Surgical Steel' },
        { label: 'Glass', value: 'Anti-Reflective Sapphire Crystal' }
      ]
    };

    try {
      if (editProduct) {
        // Edit product
        await API.put(`/products/${editProduct._id}`, payload);
        toast.success('Product updated successfully!');
      } else {
        // Create product
        await API.post('/products', payload);
        toast.success('Product created successfully!');
      }
      handleCloseForm();
      fetchProductsList();
    } catch (error) {
      console.error('Failed to submit product details:', error);
      toast.error(error.response?.data?.message || 'Error occurred while saving product details.');
    }
  };

  // Delete product
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await API.delete(`/products/${id}`);
      toast.success(`${name} deleted.`);
      fetchProductsList();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to delete product.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        
        <AdminSidebar />

        <div className="flex-grow w-full lg:w-3/4 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h1 className="font-playfair text-3xl uppercase text-white tracking-wider">Timepiece Inventory</h1>
              <p className="text-xs text-gray-500 font-light mt-1">Add, update, or remove luxury watches from the store collections.</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn-gold px-5 py-2.5 text-xs font-semibold flex items-center space-x-1.5"
            >
              <FiPlus size={14} />
              <span>Add Watch</span>
            </button>
          </div>

          {/* Add/Edit Product Details Form overlay */}
          {showForm && (
            <GlassCard className="p-8 relative">
              <button
                onClick={handleCloseForm}
                className="absolute top-6 right-6 text-gray-400 hover:text-white"
                aria-label="Close form"
              >
                <FiX size={20} />
              </button>

              <h3 className="font-playfair text-xl text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <FiLayers className="text-luxury-gold" />
                <span>{editProduct ? `Edit ${editProduct.name}` : 'Assemble New Timepiece'}</span>
              </h3>

              <form onSubmit={handleSubmit(onProductSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Name */}
                <div className="space-y-1">
                  <label htmlFor="watch-name" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Watch Model Name</label>
                  <input
                    type="text"
                    id="watch-name"
                    placeholder="Tickora Legacy Chrono"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                  />
                  {errors.name && <span className="text-[10px] text-red-500">{errors.name.message}</span>}
                </div>

                {/* SKU */}
                <div className="space-y-1">
                  <label htmlFor="watch-sku" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">SKU Reference</label>
                  <input
                    type="text"
                    id="watch-sku"
                    placeholder="TICK-LEG-CHR-GLD"
                    {...register('sku', { required: 'SKU reference is required' })}
                    className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                  />
                  {errors.sku && <span className="text-[10px] text-red-500">{errors.sku.message}</span>}
                </div>

                {/* Original Price */}
                <div className="space-y-1">
                  <label htmlFor="watch-price" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Original Price (PKR)</label>
                  <input
                    type="number"
                    id="watch-price"
                    placeholder="35000"
                    {...register('price', { required: 'Price is required' })}
                    className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                  />
                  {errors.price && <span className="text-[10px] text-red-500">{errors.price.message}</span>}
                </div>

                {/* Discount Price */}
                <div className="space-y-1">
                  <label htmlFor="watch-discount" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Discount Price (Optional)</label>
                  <input
                    type="number"
                    id="watch-discount"
                    placeholder="29999"
                    {...register('discountPrice')}
                    className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                  />
                </div>

                {/* Category selector */}
                <div className="space-y-1">
                  <label htmlFor="watch-cat" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Target Category</label>
                  <select
                    id="watch-cat"
                    {...register('category', { required: 'Category is required' })}
                    className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                  {errors.category && <span className="text-[10px] text-red-500">{errors.category.message}</span>}
                </div>

                {/* Stock */}
                <div className="space-y-1">
                  <label htmlFor="watch-stock" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Stock Quantity</label>
                  <input
                    type="number"
                    id="watch-stock"
                    placeholder="15"
                    {...register('stock', { required: 'Stock count is required' })}
                    className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                  />
                  {errors.stock && <span className="text-[10px] text-red-500">{errors.stock.message}</span>}
                </div>

                {/* Gender */}
                <div className="space-y-1">
                  <label htmlFor="watch-gender" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Gender Classification</label>
                  <select
                    id="watch-gender"
                    {...register('gender', { required: 'Gender classification required' })}
                    className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                  >
                    <option value="Unisex">Unisex</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                  </select>
                </div>

                {/* Movement */}
                <div className="space-y-1">
                  <label htmlFor="watch-move" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Movement Engine</label>
                  <select
                    id="watch-move"
                    {...register('movement', { required: 'Movement engine required' })}
                    className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                  >
                    <option value="Automatic">Automatic Self-Winding</option>
                    <option value="Quartz">Quartz Precision</option>
                    <option value="Smart">Smart Connected Hub</option>
                  </select>
                </div>

                {/* Dial Color */}
                <div className="space-y-1">
                  <label htmlFor="watch-dial" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Dial Color Accent</label>
                  <input
                    type="text"
                    id="watch-dial"
                    placeholder="Midnight Obsidian / Gilded gold"
                    {...register('dialColor', { required: 'Dial Color is required' })}
                    className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                  />
                  {errors.dialColor && <span className="text-[10px] text-red-500">{errors.dialColor.message}</span>}
                </div>

                {/* Image URLs input */}
                <div className="space-y-1">
                  <label htmlFor="watch-img" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Image URLs (comma separated)</label>
                  <input
                    type="text"
                    id="watch-img"
                    placeholder="https://image1.com, https://image2.com"
                    {...register('images', { required: 'At least one image URL is required' })}
                    className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded px-4 py-3 text-xs focus:outline-none text-white font-light"
                  />
                  {errors.images && <span className="text-[10px] text-red-500">{errors.images.message}</span>}
                </div>

                {/* Description */}
                <div className="space-y-1 sm:col-span-2">
                  <label htmlFor="watch-desc" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Description Text</label>
                  <textarea
                    id="watch-desc"
                    rows="4"
                    placeholder="Describe the aesthetic, layout, mechanics, and design feel of this watch..."
                    {...register('description', { required: 'Description content is required' })}
                    className="w-full bg-[#0b0b0b] border border-white/5 focus:border-luxury-gold/50 rounded p-3 text-xs focus:outline-none text-white font-light resize-none leading-relaxed"
                  />
                  {errors.description && <span className="text-[10px] text-red-500">{errors.description.message}</span>}
                </div>

                <div className="sm:col-span-2 pt-4 border-t border-white/5 flex justify-end">
                  <button type="submit" className="btn-gold text-xs px-8">
                    {editProduct ? 'Save Timepiece' : 'Assemble Watch'}
                  </button>
                </div>
              </form>
            </GlassCard>
          )}

          {/* Catalog items table */}
          {loading ? (
            <div className="py-12 text-center text-gray-500 font-light text-xs animate-pulse">
              Syncing products database...
            </div>
          ) : (
            <GlassCard className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-light">
                  <thead className="bg-[#121212] uppercase text-[10px] tracking-wider text-gray-500 border-b border-white/5">
                    <tr>
                      <th className="p-4 font-semibold">Watch Details</th>
                      <th className="p-4 font-semibold">SKU</th>
                      <th className="p-4 font-semibold">Category</th>
                      <th className="p-4 font-semibold">Pricing</th>
                      <th className="p-4 font-semibold">Stock</th>
                      <th className="p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.map((p) => (
                      <tr key={p._id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 flex items-center space-x-3">
                          <img src={p.images[0]} alt={p.name} className="w-9 h-9 object-cover rounded border border-white/5 flex-shrink-0" />
                          <span className="text-white font-medium line-clamp-1">{p.name}</span>
                        </td>
                        <td className="p-4 font-mono font-medium text-gray-400">{p.sku}</td>
                        <td className="p-4 text-gray-400">{p.category?.name || 'Unassigned'}</td>
                        <td className="p-4 text-white font-medium font-poppins">PKR {p.price.toLocaleString()}</td>
                        <td className={`p-4 font-semibold ${p.stock < 5 ? 'text-red-400' : 'text-gray-400'}`}>{p.stock}</td>
                        <td className="p-4 flex items-center space-x-2.5 text-gray-500">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="hover:text-luxury-gold transition-colors"
                            aria-label="Edit watch"
                          >
                            <FiEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p._id, p.name)}
                            className="hover:text-red-500 transition-colors"
                            aria-label="Delete watch"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
