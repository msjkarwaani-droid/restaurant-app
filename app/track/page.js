"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Search, Package, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast'; // 👈 Import toast for better feedback

export default function TrackOrderPage() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    // 👇 Trim whitespace to prevent "123 " vs "123" mismatches
    const cleanPhone = phone.trim();
    
    if (!cleanPhone) {
      toast.error("Please enter a phone number");
      return;
    }

    setLoading(true);
    setSearched(true);
    setOrders([]); // Clear previous results

    console.log("Searching for phone:", cleanPhone);

    // Fetch orders matching the phone number
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_phone', cleanPhone) // 👈 Exact match on trimmed phone
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase Error:", error);
      toast.error("Error fetching orders: " + error.message);
    } else {
      console.log("Found orders:", data);
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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Track Your Order</h1>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8 flex gap-2">
        <input 
          type="tel" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          {loading ? 'Searching...' : <><Search size={18} /> Track</>}
        </button>
      </form>

      {/* Results */}
      {searched && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-center text-gray-500">No orders found for this phone number.</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">Order #{order.id.slice(0, 8)}</h3>
                    <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold capitalize
                    ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                      order.status === 'preparing' ? 'bg-blue-100 text-blue-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm text-gray-600 mb-2"><strong>Items:</strong></p>
                  <ul className="list-disc list-inside text-sm text-gray-700 mb-4">
                    {/* Check if items is an array (it should be from JSONB) */}
                    {Array.isArray(order.items) ? order.items.map((item, idx) => (
                      <li key={idx}>{item.quantity}x {item.name}</li>
                    )) : <li>Order details unavailable</li>}
                  </ul>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Paid:</span>
                    <span>${order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}