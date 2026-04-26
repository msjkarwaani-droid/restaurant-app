"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import MenuItemCard from '@/components/MenuItemCard';
import SkeletonCard from '@/components/SkeletonCard'; // 👈 Import Skeleton
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_available', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) console.error('Error fetching dishes:', error);
    else setDishes(data || []);
    
    setLoading(false);
  };

  const filteredDishes = dishes.filter(dish => {
    const matchesCategory = selectedCategory === 'all' || dish.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      dish.name.toLowerCase().includes(query) || 
      dish.description.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen w-full bg-gradient-menu">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-800 mb-6 text-center"
      >
        Our Menu
      </motion.h1>
      
      {/* Search Bar */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto mb-6 relative"
      >
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search for dishes..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none shadow-sm transition-all duration-300 focus:shadow-md"
        />
      </motion.div>

      {/* Category Filter Buttons */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center gap-2 mb-8 flex-wrap"
      >
        {['all', 'starter', 'main', 'dessert', 'drink'].map((cat) => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
              selectedCategory === cat ? 'bg-orange-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Loading State with Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredDishes.length === 0 ? (
        <p className="text-center text-gray-500">No dishes found matching your criteria.</p>
      ) : (
        /* Animated Grid */
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredDishes.map((dish, index) => (
            <motion.div key={dish.id} variants={itemVariants}>
              <MenuItemCard 
                dish={dish} 
                priority={index < 6} 
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}