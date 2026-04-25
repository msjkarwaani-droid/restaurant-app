"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import MenuItemCard from '@/components/MenuItemCard';
import { Search } from 'lucide-react'; // Make sure you have lucide-react installed

export default function Home() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState(''); // 👈 New State for Search

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

  // 👈 Combined Filter Logic: Category AND Search Query
  const filteredDishes = dishes.filter(dish => {
    // 1. Check Category
    const matchesCategory = selectedCategory === 'all' || dish.category === selectedCategory;
    
    // 2. Check Search Query (Case-insensitive)
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      dish.name.toLowerCase().includes(query) || 
      dish.description.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  if (loading) return <div className="text-center mt-10 text-xl">Loading deliciousness...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Menu</h1>
      
      {/* 👈 Search Bar */}
      <div className="max-w-md mx-auto mb-6 relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search for dishes..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
        />
      </div>

      {/* Category Filter Buttons */}
      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        <button 
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full font-medium transition ${selectedCategory === 'all' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          All
        </button>
        <button 
          onClick={() => setSelectedCategory('starter')}
          className={`px-4 py-2 rounded-full font-medium transition ${selectedCategory === 'starter' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Starters
        </button>
        <button 
          onClick={() => setSelectedCategory('main')}
          className={`px-4 py-2 rounded-full font-medium transition ${selectedCategory === 'main' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Mains
        </button>
        <button 
          onClick={() => setSelectedCategory('dessert')}
          className={`px-4 py-2 rounded-full font-medium transition ${selectedCategory === 'dessert' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Desserts
        </button>
        <button 
          onClick={() => setSelectedCategory('drink')}
          className={`px-4 py-2 rounded-full font-medium transition ${selectedCategory === 'drink' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Drinks
        </button>
      </div>

      {filteredDishes.length === 0 ? (
        <p className="text-center text-gray-500">No dishes found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map((dish) => (
            <MenuItemCard key={dish.id} dish={dish} />
          ))}
        </div>
      )}
    </div>
  );
}