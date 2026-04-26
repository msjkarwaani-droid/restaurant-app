import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext"; // 👈 Make sure this path is correct
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Tasty Bites Restaurant",
  description: "Fresh ingredients, amazing taste.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        {/* 👇 Wrap everything in CartProvider */}
        <CartProvider>
          <Navbar />
          <main className="flex-1 container mx-auto p-4 pt-24">
            {children}
          </main>
          <footer className="bg-gray-800 text-white py-6 mt-auto">
            <div className="container mx-auto text-center px-4">
              <p>&copy; {new Date().getFullYear()} Tasty Bites Restaurant. All rights reserved.</p>
            </div>
          </footer>
        </CartProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  );
}