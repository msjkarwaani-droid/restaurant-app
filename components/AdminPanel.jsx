import Image from 'next/image';

export default function AdminPanel({ dishes, onEdit, onDelete }) {
  if (dishes.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow border border-dashed border-gray-300">
        <p className="text-gray-500">No dishes found. Click "Add New Dish" to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-700">Image</th>
              <th className="p-4 font-semibold text-gray-700">Name</th>
              <th className="p-4 font-semibold text-gray-700">Category</th>
              <th className="p-4 font-semibold text-gray-700">Price</th>
              <th className="p-4 font-semibold text-gray-700">Status</th>
              <th className="p-4 font-semibold text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dishes.map((dish) => (
              <tr key={dish.id} className="hover:bg-gray-50 transition">
                <td className="p-4">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-200">
                    {dish.image_url ? (
                      <Image src={dish.image_url} alt={dish.name} fill className="object-cover" sizes="100px" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-gray-400">No Img</div>
                    )}
                  </div>
                </td>
                <td className="p-4 font-medium text-gray-900">{dish.name}</td>
                <td className="p-4 text-gray-600 capitalize">{dish.category}</td>
                <td className="p-4 text-gray-900 font-semibold">${dish.price}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full font-semibold ${dish.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {dish.is_available ? 'Available' : 'Out of Stock'}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button 
                    onClick={() => onEdit(dish)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => onDelete(dish.id)}
                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}