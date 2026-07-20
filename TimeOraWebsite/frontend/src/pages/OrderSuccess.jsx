import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiInbox, FiTrendingUp } from 'react-icons/fi';
import API from '../services/api.js';
import GlassCard from '../components/common/GlassCard.jsx';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/orders/${orderId}`)
      .then((res) => {
        setOrder(res.data.data);
      })
      .catch((err) => {
        console.error('Error loading placed order details:', err);
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-white text-center">
      <div className="mb-6 flex justify-center text-luxury-gold animate-bounce">
        <FiCheckCircle size={64} className="stroke-1" />
      </div>

      <h1 className="font-playfair text-3xl sm:text-5xl uppercase tracking-wider text-white mb-3">Order Placed!</h1>
      <p className="text-xs uppercase tracking-widest text-luxury-gold mb-8">Thank you for choosing Tickora</p>

      <GlassCard className="p-8 text-left space-y-6 mb-10">
        <div className="border-b border-white/5 pb-4 flex justify-between items-center text-xs tracking-wider uppercase text-gray-400">
          <span>Order ID: <span className="text-white font-medium">{orderId}</span></span>
          <span>Status: <span className="text-luxury-gold font-bold">{order?.orderStatus || 'Pending'}</span></span>
        </div>

        {/* Pricing totals */}
        <div className="grid grid-cols-2 gap-4 text-xs font-light text-gray-400">
          <div>
            <h4 className="text-luxury-gold uppercase tracking-widest font-semibold mb-1">Delivering To</h4>
            <p className="font-medium text-white">{order?.shippingAddress.street}</p>
            <p>{order?.shippingAddress.city}, {order?.shippingAddress.state}</p>
            <p>Phone: {order?.shippingAddress.phone}</p>
          </div>
          <div>
            <h4 className="text-luxury-gold uppercase tracking-widest font-semibold mb-1">Payment Method</h4>
            <p className="uppercase text-white font-medium">{order?.paymentMethod.replace('_', ' ')}</p>
            <p>Paid Status: <span className={order?.isPaid ? 'text-green-400 font-medium' : 'text-yellow-400 font-medium'}>{order?.isPaid ? 'Paid' : 'Pending Verification'}</span></p>
          </div>
        </div>

        {/* Items breakdown list */}
        {order?.orderItems && (
          <div className="border-t border-white/5 pt-4 space-y-3">
            <h4 className="font-playfair text-xs uppercase tracking-widest text-gray-400 mb-2">Items Ordered</h4>
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs font-light">
                <span className="text-gray-300">{item.name} ({item.quantity}x)</span>
                <span className="text-white font-medium">PKR {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t border-white/5 pt-3 flex justify-between items-center text-sm font-semibold">
              <span>Grand Total</span>
              <span className="text-luxury-gold">PKR {order.totalPrice.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Dynamic Payment instruction helper */}
        {order?.paymentMethod === 'bank_transfer' && (
          <div className="bg-luxury-gold/5 border border-luxury-gold/15 p-4 rounded text-[11px] leading-relaxed text-gray-300 font-light space-y-1.5">
            <h4 className="font-poppins uppercase tracking-widest text-luxury-gold font-bold">Transfer Verification Instructions</h4>
            <p>Please send <span className="text-white font-medium">PKR {order.totalPrice.toLocaleString()}</span> to the IBAN Account: <span className="text-white font-medium">PK89ALFA1023987452391</span>.</p>
            <p>Take a screenshot/receipt of the transfer confirmation, and email it to <span className="text-white">billing@tickora.com</span> or WhatsApp it to <span className="text-white">+923001234567</span> along with your Order ID.</p>
          </div>
        )}
      </GlassCard>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link to="/shop" className="btn-outline-gold px-8 py-3.5 text-xs font-bold flex items-center justify-center gap-2">
          <FiInbox size={14} />
          <span>Continue Shopping</span>
        </Link>
        <Link to="/profile" className="btn-gold px-8 py-3.5 text-xs font-bold flex items-center justify-center gap-2">
          <FiTrendingUp size={14} />
          <span>View Order Status</span>
        </Link>
      </div>

    </div>
  );
};

export default OrderSuccess;
