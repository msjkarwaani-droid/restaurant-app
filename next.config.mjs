/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pjbhzigrxgnhatkvbprf.supabase.co', // 👈 REPLACE THIS WITH YOUR ACTUAL SUPABASE PROJECT ID
        port: '',
        pathname: '/storage/v1/object/public/menu_images/**',
      },
    ],
  },
};

export default nextConfig;