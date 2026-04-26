"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Search, Package, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function TrackOrderPage() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    const cleanPhone = phone.trim();
    
    if (!cleanPhone) {
      toast.error("Please enter a phone number");
      return;
    }

    setLoading(true);
    setSearched(true);
    setOrders([]);

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_phone', cleanPhone)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase Error:", error);
      toast.error("Error fetching orders: " + error.message);
    } else {
      if (data && data.length > 0) {
        setOrders(data);
        toast.success(`Found ${data.length} order(s)!`);
      } else {
        setOrders([]);
        toast("No orders found for this number.", { icon: 'ℹ️' });
      }
    }
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="text-yellow-500" size={20} />;
      case 'preparing': return <Package className="text-blue-500" size={20} />;
      case 'delivered': return <CheckCircle className="text-green-500" size={20} />;
      default: return <Clock className="text-gray-500" size={20} />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full bg-immersive-track flex items-center justify-center p-4"
    >
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20 relative z-10">
        
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Track Your Order</h1>
        
        <form onSubmit={handleSearch} className="mb-8 flex flex-col sm:flex-row gap-3">
          <input 
            type="tel" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number..."
            className="flex-1 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white shadow-sm"
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg shadow-orange-200"
          >
            {loading ? 'Searching...' : <><Search size={20} /> Track</>}
          </button>
        </form>

        {searched && (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {orders.length === 0 ? (
              <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p>No orders found for this phone number.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">Order #{order.id.slice(0, 8)}</h3>
                      <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <div className={`mt-2 sm:mt-0 flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold capitalize
                      ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                        order.status === 'preparing' ? 'bg-blue-100 text-blue-700' : 
                        'bg-yellow-100 text-yellow-700'}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">Items:</p>
                    <ul className="list-disc list-inside text-sm text-gray-700 mb-4 space-y-1">
                      {Array.isArray(order.items) ? order.items.map((item, idx) => (
                        <li key={idx}>{item.quantity}x {item.name}</li>
                      )) : <li>Order details unavailable</li>}
                    </ul>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <span className="text-gray-500 text-sm">Total Paid</span>
                      <span className="font-bold text-xl text-orange-600">${order.total_amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}