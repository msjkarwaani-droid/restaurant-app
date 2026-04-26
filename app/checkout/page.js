"use client";

import { useState, useEffect } from 'react'; // 👈 Added useEffect
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // 👈 Added Link for the back button
import toast from 'react-hot-toast'; // 👈 Import toast

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  // 👇 Use useEffect to handle the redirect safely
  useEffect(() => {
    if (cart.length === 0) {
      router.push('/');
    }
  }, [cart, router]);

  // If cart is empty, show nothing while redirecting
  if (cart.length === 0) {
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_address: formData.address,
        total_amount: total,
        items: cart,
        status: 'pending'
      };

      const { error } = await supabase.from('orders').insert([orderData]);

      if (error) throw error;

      toast('Order placed successfully! We will contact you shortly.');
      clearCart();
      router.push('/');

    } catch (err) {
      console.error(err);
      toast('Error placing order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/cart" className="text-gray-500 hover:text-orange-600 flex items-center gap-1">
          ← Back to Cart
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        
        {/* Order Summary */}
        <div className="mb-6 pb-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between text-sm mb-2">
              <span>{item.quantity}x {item.name}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-100">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-base"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-base"
              placeholder="+1 234 567 890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
            <textarea 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              required
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none text-base"
              placeholder="123 Food Street, Tasty City"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
}