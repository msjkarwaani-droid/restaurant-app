"use client";

// 👇 MERGE ALL REACT IMPORTS INTO ONE LINE
import { useEffect, useState, useRef } from 'react'; 

import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import AdminPanel from "@/components/AdminPanel";
import AddDishModal from "@/components/AddDishModal";
import AdminLoginModal from "@/components/AdminLoginModal";
import toast from 'react-hot-toast';

const ADMIN_EMAIL = "shoaibjami71@gmail.com";

export default function AdminPage() {
  const [dishes, setDishes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const router = useRouter();
  const logoutTimer = useRef(null); // 👈 Define ref here inside the component

  // ... rest of the code ...

  // 👇 Check Auth and Fetch Data ONLY on Client Mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        setUser(null);
        setShowLoginModal(true);
        setLoading(false);
        return;
      }

      if (session.user.email !== ADMIN_EMAIL) {
        alert("Access Denied: You are not an administrator.");
        router.push("/");
        return;
      }

      setUser(session.user);
      fetchData();
      setLoading(false);
    } catch (error) {
      console.error("Auth Error:", error);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    // Fetch Dishes
    const { data: dishesData, error: dishesError } = await supabase
      .from("menu_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (dishesError) console.error("Error fetching dishes:", dishesError);
    else setDishes(dishesData || []);

    // Fetch Orders
    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (ordersError) console.error("Error fetching orders:", ordersError);
    else setOrders(ordersData || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowLoginModal(true);
    router.push('/');
  };

  const handleAddNew = () => {
    setEditingDish(null);
    setIsModalOpen(true);
  };

  const handleEdit = (dish) => {
    setEditingDish(dish);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dish?")) return;

    const { error } = await supabase.from("menu_items").delete().eq("id", id);

    if (error) {
      toast.error("Error deleting dish: " + error.message);
    } else {
      setDishes(dishes.filter((d) => d.id !== id));
      toast.success("Dish deleted successfully!");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    console.log("🔄 Attempting to update order:", orderId, "to status:", newStatus);

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      console.error("❌ Supabase Update Error:", error);
      toast.error("Failed to update status: " + error.message);
    } else {
      console.log("✅ Status updated successfully in DB");
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      toast.success(`Order status updated to ${newStatus}!`);

      // Optional: Send Email Notification Logic Here
    }
  };

  // Auto-logout after 30 minutes of inactivity
  useEffect(() => {
    if (!user) return;

    const handleActivity = () => {
      clearTimeout(logoutTimer.current);
      logoutTimer.current = setTimeout(async () => {
        console.log("Session expired due to inactivity");
        await supabase.auth.signOut();
        setUser(null);
        setShowLoginModal(true);
        toast.error("Session expired. Please log in again.");
      }, 30 * 60 * 1000);
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    handleActivity();

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
    };
  }, [user]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingDish(null);
    fetchData();
  };

  if (loading)
    return <div className="text-center mt-10">Checking permissions...</div>;

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      {user ? (
        <div>
          <div className="flex justify-between items-center mb-6 pt-4">
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 hidden md:block">
                Logged in as: {user.email}
              </span>
              
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
              >
                Logout
              </button>

              <button
                onClick={handleAddNew}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                + Add New Dish
              </button>
            </div>
          </div>

          {/* Manage Orders */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 border-b pb-2">Recent Orders</h2>
            <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-4 font-semibold text-gray-600">ID</th>
                    <th className="p-4 font-semibold text-gray-600">Customer</th>
                    <th className="p-4 font-semibold text-gray-600">Total</th>
                    <th className="p-4 font-semibold text-gray-600">Status</th>
                    <th className="p-4 font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.length === 0 ? (
                    <tr><td colSpan="5" className="p-4 text-center text-gray-500">No orders yet.</td></tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="p-4 text-xs text-gray-500">{order.id.slice(0, 8)}...</td>
                        <td className="p-4">
                          <div className="font-medium">{order.customer_name}</div>
                          <div className="text-xs text-gray-500">{order.customer_phone}</div>
                        </td>
                        <td className="p-4 font-bold">${order.total_amount.toFixed(2)}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize
                            ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                              order.status === 'preparing' ? 'bg-blue-100 text-blue-800' : 
                              'bg-yellow-100 text-yellow-800'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <select 
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="border border-gray-300 rounded p-1 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="preparing">Preparing</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Manage Dishes */}
          <div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4 border-b pb-2">Menu Items</h2>
            <AdminPanel
              dishes={dishes}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>

          {isModalOpen && (
            <AddDishModal
              isOpen={isModalOpen}
              onClose={handleModalClose}
              initialData={editingDish}
            />
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
          <h2 className="text-2xl font-bold mb-2">Admin Area Locked</h2>
          <p>Please log in to continue.</p>
        </div>
      )}

      <AdminLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}