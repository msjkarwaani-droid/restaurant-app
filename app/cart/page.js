"use client";

import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added any deliciousness yet!</p>
        <Link 
          href="/" 
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-bold transition"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {cart.map((item) => (
          <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 border-b border-gray-100 last:border-0">
            
            {/* Item Image */}
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
              {item.image_url ? (
                <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="100px" />
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-gray-400">No Img</div>
              )}
            </div>

            {/* Item Details */}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-bold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-500">${item.price} each</p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
              <button 
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="p-1 hover:bg-white rounded-md shadow-sm transition disabled:opacity-50"
                disabled={item.quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-semibold">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="p-1 hover:bg-white rounded-md shadow-sm transition"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Subtotal */}
            <div className="font-bold text-gray-800 w-20 text-right">
              ${(item.price * item.quantity).toFixed(2)}
            </div>

            {/* Remove Button */}
            <button 
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Total & Checkout Section */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-4 sm:mb-0">
          <p className="text-gray-500">Total Items: {cart.reduce((acc, item) => acc + item.quantity, 0)}</p>
          <h2 className="text-2xl font-bold text-gray-800">Total: ${total.toFixed(2)}</h2>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={clearCart}
            className="px-4 py-2 text-red-600 font-semibold hover:bg-red-50 rounded-lg transition"
          >
            Clear Cart
          </button>
          <Link 
  href="/checkout" 
  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition shadow-lg shadow-green-200 inline-block text-center"
>
  Proceed to Checkout
</Link>
        </div>
      </div>
    </div>
  );
}