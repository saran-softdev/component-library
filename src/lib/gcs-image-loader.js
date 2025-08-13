"use client";
/**
 * Custom image loader for PMS with GCS + other sources
 */
const gcsImageLoader = ({ src, width, quality = 75 }) => {
  if (!src) return "";

  // ✅ Skip modification for certain external sources
  const passthroughHosts = [
    "images.unsplash.com",
    "img.freepik.com",
    "lh3.googleusercontent.com",
    "media.licdn.com"
  ];
  try {
    const urlHost = new URL(src).hostname;
    if (passthroughHosts.includes(urlHost)) {
      return src; // Just return original URL
    }
  } catch {
    // Not an absolute URL, continue normal logic
  }

  const appendSizeParams = (url) => {
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}w=${encodeURIComponent(width || "auto")}${
      quality ? `&q=${encodeURIComponent(quality)}` : ""
    }`;
  };

  // Absolute URLs (e.g., GCS links)
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return appendSizeParams(src);
  }

  // Data/blob URLs
  if (src.startsWith("data:") || src.startsWith("blob:")) {
    return src;
  }

  // Local public/static assets
  if (
    src.startsWith("/") ||
    src.startsWith("/_next/") ||
    src.startsWith("/static/") ||
    src.startsWith("/favicon") ||
    src.startsWith("/icons/") ||
    src.startsWith("/public/")
  ) {
    const normalized = src.startsWith("/public/")
      ? src.replace(/^\/public\//, "/")
      : src;
    return appendSizeParams(normalized);
  }

  // DB relative paths → prefix with NEXT_PUBLIC_IMAGE_URL
  const baseUrl =
    process.env.NEXT_PUBLIC_IMAGE_URL || "https://storage.googleapis.com/";
  const cleanBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const cleanSrc = src.startsWith("/") ? src.slice(1) : src;
  return appendSizeParams(`${cleanBase}${cleanSrc}`);
};

export default gcsImageLoader;
