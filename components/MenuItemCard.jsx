"use client";

import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion'; // 👈 Import motion

export default function MenuItemCard({ dish, priority = false }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(dish);
    toast.success(`${dish.name} added to cart!`, {
      icon: '🛒',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  return (
    /* 👇 Card Container with Hover Lift & Shadow */
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full overflow-hidden group"
    >
      
      {/* 👇 Image Container with Zoom Effect */}
      <div className="relative w-full aspect-[4/3] bg-gray-200 overflow-hidden">
        {dish.image_url ? (
          <Image 
            src={dish.image_url} 
            alt={dish.name} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-110" // 👈 Zoom on hover
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image
          </div>
        )}
        
        {/* Optional: Category Badge Overlay */}
        <div className="absolute top-3 left-3">
           <span className="bg-white/90 backdrop-blur-sm text-orange-600 text-xs px-3 py-1 rounded-full uppercase tracking-wide font-bold shadow-sm">
            {dish.category}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col min-w-0">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800 truncate pr-2">{dish.name}</h3>
          <span className="text-orange-600 font-bold text-lg whitespace-nowrap">${dish.price}</span>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1 leading-relaxed">
          {dish.description}
        </p>

        {/* Add to Cart Button with Hover Effect */}
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 mt-auto shadow-md hover:shadow-orange-200/50"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
}