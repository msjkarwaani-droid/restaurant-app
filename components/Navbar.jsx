"use client";

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Menu } from 'lucide-react'; // 👈 Added Menu icon
import { useState } from 'react';

export default function Navbar() {
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-orange-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold tracking-tighter">
          🍕 Tasty Bites
        </Link>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white"
        >
          <Menu size={24} />
        </button>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-white hover:text-orange-200 transition">
            Menu
          </Link>
          <Link href="/track" className="text-white hover:text-orange-200 transition">
            Track Order
          </Link>
          <Link href="/cart" className="relative group">
            <ShoppingCart className="text-white group-hover:text-orange-200 transition" size={24} />
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

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-orange-500 pt-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="text-white hover:text-orange-200 transition" onClick={() => setIsMenuOpen(false)}>
              Menu
            </Link>
            <Link href="/track" className="text-white hover:text-orange-200 transition" onClick={() => setIsMenuOpen(false)}>
              Track Order
            </Link>
            <Link href="/cart" className="text-white hover:text-orange-200 transition flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
              <ShoppingCart size={18} />
              Cart ({itemCount})
            </Link>
            <Link href="/admin" className="text-white hover:text-orange-200 transition font-semibold" onClick={() => setIsMenuOpen(false)}>
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}