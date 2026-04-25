"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { X, Upload } from 'lucide-react';
import Image from 'next/image';

export default function AddDishModal({ isOpen, onClose, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main',
    is_available: true,
    image_url: ''
  });
  
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Populate form if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || '',
        category: initialData.category || 'main',
        is_available: initialData.is_available ?? true,
        image_url: initialData.image_url || ''
      });
      setPreviewUrl(initialData.image_url || '');
    } else {
      // Reset for new dish
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'main',
        is_available: true,
        image_url: ''
      });
      setFile(null);
      setPreviewUrl('');
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const uploadImage = async () => {
    if (!file) return formData.image_url;

    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;
    const filePath = `menu_images/${fileName}`;

    const { error } = await supabase.storage
      .from('menu_images')
      .upload(filePath, file);

    if (error) {
      alert('Image upload failed: ' + error.message);
      setUploading(false);
      return null;
    }

    const { data } = supabase.storage.from('menu_images').getPublicUrl(filePath);
    setUploading(false);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Upload Image if new file selected
      let finalImageUrl = formData.image_url;
      if (file) {
        finalImageUrl = await uploadImage();
        if (!finalImageUrl) throw new Error("Image upload failed");
      }

      // 2. Prepare Data
      const payload = {
        ...formData,
        image_url: finalImageUrl,
        price: parseFloat(formData.price) // Ensure price is a number
      };

      // 3. Insert or Update
      let error;
      if (initialData) {
        // Update existing
        const { error: updateError } = await supabase
          .from('menu_items')
          .update(payload)
          .eq('id', initialData.id);
        error = updateError;
      } else {
        // Create new
        const { error: insertError } = await supabase
          .from('menu_items')
          .insert([payload]);
        error = insertError;
      }

      if (error) throw error;

      alert(initialData ? 'Dish updated successfully!' : 'Dish added successfully!');
      onClose();

    } catch (err) {
      console.error(err);
      alert('Error saving dish: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? 'Edit Dish' : 'Add New Dish'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Image Upload */}
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
              {previewUrl ? (
                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <Upload size={24} />
                </div>
              )}
            </div>
            <label className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 font-medium">
              {previewUrl ? 'Change Image' : 'Upload Image'}
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            {uploading && <span className="text-xs text-orange-500">Uploading...</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dish Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="e.g. Margherita Pizza"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
              >
                <option value="starter">Starter</option>
                <option value="main">Main Course</option>
                <option value="dessert">Dessert</option>
                <option value="drink">Drink</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input 
                type="number" 
                step="0.01"
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none"
              placeholder="Short description of ingredients..."
            ></textarea>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              name="is_available" 
              checked={formData.is_available} 
              onChange={handleChange}
              className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">Available for ordering</span>
          </div>

          <button 
            type="submit" 
            disabled={loading || uploading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Saving...' : initialData ? 'Update Dish' : 'Add Dish'}
          </button>

        </form>
      </div>
    </div>
  );
}