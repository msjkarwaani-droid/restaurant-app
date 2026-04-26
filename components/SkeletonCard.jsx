import { motion } from 'framer-motion';

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 h-[400px] overflow-hidden animate-pulse">
      <div className="bg-gray-200 h-48 w-full"></div>
      <div className="p-5 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-20 bg-gray-200 rounded w-full"></div>
        <div className="h-12 bg-gray-200 rounded w-full mt-4"></div>
      </div>
    </div>
  );
}