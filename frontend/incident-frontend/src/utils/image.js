export const getImageUrl = (url) => {
  if (!url) return null;

  // already full URL (Cloudinary or external)
  if (url.startsWith("http")) return url;

  // ensure leading slash
  if (!url.startsWith("/")) {
    url = "/" + url;
  }

  return `https://incident-reporting-rjwi.onrender.com${url}`;
};