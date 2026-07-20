import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { FiTrendingUp, FiShoppingBag, FiUsers, FiAlertCircle } from 'react-icons/fi';
import API from '../services/api.js';
import AdminSidebar from '../components/admin/AdminSidebar.jsx';
import GlassCard from '../components/common/GlassCard.jsx';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders/analytics')
      .then((res) => {
        setMetrics(res.data.data);
      })
      .catch((err) => {
        console.error('Failed to load metrics:', err);
        toast.error('Could not sync dashboard analytics.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-white">
        <div className="w-12 h-12 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs text-gray-500 font-light">Loading analytics control center...</p>
      </div>
    );
  }

  const { summary, monthlySales, recentOrders } = metrics;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        
        {/* Navigation Sidebar */}
        <AdminSidebar />

        {/* Dashboard Analytics View Workspace */}
        <div className="flex-grow space-y-8 w-full lg:w-3/4">
          
          {/* Header Title */}
          <div>
            <h1 className="font-playfair text-3xl uppercase text-white tracking-wider">Atelier Performance</h1>
            <p className="text-xs text-gray-500 font-light mt-1">Real-time revenue metrics, order statuses, and low stock warnings.</p>
          </div>

          {/* Analytics Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Revenue */}
            <GlassCard className="p-5 flex items-center space-x-4">
              <div className="p-3 bg-luxury-gold/10 text-luxury-gold rounded">
                <FiTrendingUp size={20} />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold block">Total Revenue</span>
                <span className="text-base font-bold font-poppins">PKR {summary.totalRevenue.toLocaleString()}</span>
              </div>
            </GlassCard>

            {/* Orders */}
            <GlassCard className="p-5 flex items-center space-x-4">
              <div className="p-3 bg-luxury-gold/10 text-luxury-gold rounded">
                <FiShoppingBag size={20} />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold block">Total Orders</span>
                <span className="text-base font-bold font-poppins">{summary.totalOrders}</span>
              </div>
            </GlassCard>

            {/* Customers */}
            <GlassCard className="p-5 flex items-center space-x-4">
              <div className="p-3 bg-luxury-gold/10 text-luxury-gold rounded">
                <FiUsers size={20} />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold block">Customers</span>
                <span className="text-base font-bold font-poppins">{summary.totalCustomers}</span>
              </div>
            </GlassCard>

            {/* Low stock Alert */}
            <GlassCard className={`p-5 flex items-center space-x-4 border ${summary.totalLowStock > 0 ? 'border-red-500/20 bg-red-950/5' : ''}`}>
              <div className={`p-3 rounded ${summary.totalLowStock > 0 ? 'bg-red-500/10 text-red-400' : 'bg-luxury-gold/10 text-luxury-gold'}`}>
                <FiAlertCircle size={20} />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold block">Low Inventory Items</span>
                <span className={`text-base font-bold font-poppins ${summary.totalLowStock > 0 ? 'text-red-400' : ''}`}>{summary.totalLowStock}</span>
              </div>
            </GlassCard>

          </div>

          {/* Charts Row */}
          {monthlySales && monthlySales.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Revenue Area Chart */}
              <GlassCard className="p-6 space-y-4">
                <h3 className="font-playfair text-sm uppercase tracking-widest text-white">Monthly Revenue (PKR)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlySales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" />
                      <XAxis dataKey="month" stroke="#777" fontSize={10} />
                      <YAxis stroke="#777" fontSize={10} />
                      <Tooltip contentStyle={{ background: '#121212', border: '1px solid #333', fontSize: 11 }} />
                      <Area type="monotone" dataKey="revenue" stroke="#D4AF37" fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              {/* Orders Bar Chart */}
              <GlassCard className="p-6 space-y-4">
                <h3 className="font-playfair text-sm uppercase tracking-widest text-white">Monthly Orders (Qty)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlySales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" />
                      <XAxis dataKey="month" stroke="#777" fontSize={10} />
                      <YAxis stroke="#777" fontSize={10} />
                      <Tooltip contentStyle={{ background: '#121212', border: '1px solid #333', fontSize: 11 }} />
                      <Bar dataKey="orders" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

            </div>
          )}

          {/* Recent Orders List Table */}
          <div className="space-y-4">
            <h3 className="font-playfair text-lg text-white uppercase tracking-wider">Recent Orders</h3>
            
            <GlassCard className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-light">
                  <thead className="bg-[#121212] uppercase text-[10px] tracking-wider text-gray-500 border-b border-white/5">
                    <tr>
                      <th className="p-4 font-semibold">Order ID</th>
                      <th className="p-4 font-semibold">Client</th>
                      <th className="p-4 font-semibold">Date</th>
                      <th className="p-4 font-semibold">Total Price</th>
                      <th className="p-4 font-semibold">Payment</th>
                      <th className="p-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentOrders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-mono font-medium text-white">{ord._id.substring(ord._id.length - 8)}</td>
                        <td className="p-4">{ord.user?.name || 'Guest'}</td>
                        <td className="p-4">{new Date(ord.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 text-white font-medium">PKR {ord.totalPrice.toLocaleString()}</td>
                        <td className="p-4 uppercase text-[10px]">{ord.paymentMethod}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-sm text-[9px] uppercase font-bold ${
                            ord.orderStatus === 'Delivered' 
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                              : ord.orderStatus === 'Cancelled' 
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          }`}>
                            {ord.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
