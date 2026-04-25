"use client";

import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MenuItemCard({ dish }) {
  const { addToCart } = useCart();

// Inside handleAddToCart:
const handleAddToCart = () => {
  addToCart(dish);
  toast.success(`${dish.name} added to cart!`); // 👈 Use toast
};

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 border border-gray-100 flex flex-col">
      {/* Image Area */}
      <div className="relative h-48 w-full bg-gray-200">
        {dish.image_url ? (
          <Image 
            src={dish.image_url} 
            alt={dish.name} 
            fill 
            className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800">{dish.name}</h3>
          <span className="text-orange-600 font-bold text-lg">${dish.price}</span>
        </div>
        
        <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full uppercase tracking-wide font-semibold mb-2 w-fit">
          {dish.category}
        </span>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
          {dish.description}
        </p>

        {/* Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded-lg transition flex items-center justify-center gap-2"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}