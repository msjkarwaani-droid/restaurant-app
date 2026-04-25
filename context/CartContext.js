"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }) {
  // Load cart from localStorage on initial load to persist data
  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('tastyBitesCart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tastyBitesCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (dish) => {
    setCart((prevCart) => {
      // Check if item already exists
      const existingItem = prevCart.find(item => item.id === dish.id);
      
      if (existingItem) {
        // If yes, increase quantity
        return prevCart.map(item => 
          item.id === dish.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // If no, add new item with quantity 1
        return [...prevCart, { ...dish, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return; // Prevent negative quantities
    setCart((prevCart) => 
      prevCart.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculate Total Price
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}