"use client";

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Menu } from 'lucide-react';
import { useState, useEffect } from 'react'; // 👈 Import useEffect

export default function Navbar() {
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // 👈 Add mounted state

  // 👈 Set mounted to true once the component loads in the browser
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto p-4 flex justify-between items-center">
        
        <Link href="/" className="text-orange-600 text-2xl font-bold tracking-tighter flex items-center gap-2 hover:scale-105 transition-transform">
          🍕 Tasty Bites
        </Link>

        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-800"
        >
          <Menu size={24} />
        </button>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-gray-800 hover:text-orange-600 font-medium transition-colors duration-300">
            Menu
          </Link>
          <Link href="/track" className="text-gray-800 hover:text-orange-600 font-medium transition-colors duration-300">
            Track Order
          </Link>
          
          {/* Cart Icon */}
          <Link href="/cart" className="relative group text-gray-800 hover:text-orange-600 transition-colors duration-300">
            <ShoppingCart size={24} />
            
            {/* 👇 Only render the badge if mounted is true */}
            {mounted && itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce-short">
                {itemCount}
              </span>
            )}
          </Link>

          <Link href="/admin" className="text-gray-800 hover:text-orange-600 font-semibold transition-colors duration-300">
            Admin
          </Link>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 bg-white">
          <div className="flex flex-col gap-4 px-4">
            <Link href="/" className="text-gray-800 hover:text-orange-600 font-medium" onClick={() => setIsMenuOpen(false)}>
              Menu
            </Link>
            <Link href="/track" className="text-gray-800 hover:text-orange-600 font-medium" onClick={() => setIsMenuOpen(false)}>
              Track Order
            </Link>
            <Link href="/cart" className="text-gray-800 hover:text-orange-600 font-medium flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
              <ShoppingCart size={18} />
              Cart ({mounted ? itemCount : 0})
            </Link>
            <Link href="/admin" className="text-gray-800 hover:text-orange-600 font-semibold" onClick={() => setIsMenuOpen(false)}>
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}