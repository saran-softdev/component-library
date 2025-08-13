/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Use custom loader to bypass /_next/image endpoint on Cloud Run
    // Official docs: https://nextjs.org/docs/app/api-reference/next-config-js/images#loader-configuration
    loader: "custom",
    loaderFile: "./src/lib/gcs-image-loader.js",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com"
      },
      {
        protocol: "https",
        hostname: "img.freepik.com"
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com" // 👈 add this
      },
      {
        protocol: "https",
        hostname: "media.licdn.com" // 👈 add this line
      }
    ]
  }
};

export default nextConfig;
