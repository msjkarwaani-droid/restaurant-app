"use client";

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';

export default function Navbar() {
  const { itemCount } = useCart();

  return (
    <nav className="bg-orange-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold tracking-tighter">
          🍕 Tasty Bites
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/" className="text-white hover:text-orange-200 transition">
            Menu
          </Link>
          
          {/* 👇 Track Order Link */}
          <Link href="/track" className="text-white hover:text-orange-200 transition">
            Track Order
          </Link>
          
          {/* Cart Link with Badge */}
          <Link href="/cart" className="relative group">
            <ShoppingCart className="text-white group-hover:text-orange-200 transition" size={24} />
            
            {/* Badge showing item count */}
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-orange-600">
                {itemCount}
              </span>
            )}
          </Link>

          <Link href="/admin" className="text-white hover:text-orange-200 transition font-semibold">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}