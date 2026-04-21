export const getImageUrl = (url) => {
  if (!url) return null;

  // already full URL (Cloudinary or external)
  if (url.startsWith("http")) return url;

  // Django media fallback
  return `https://incident-reporting-rjwi.onrender.com${url}`;
};
