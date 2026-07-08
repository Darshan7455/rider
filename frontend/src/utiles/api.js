const API_BASE_URL = (
	import.meta.env.VITE_API_BASE_URL ||
	import.meta.env.VITE_BASE_URL ||
	"https://rider-api-r8sz.onrender.com"
).replace(/\/$/, "");

export const apiUrl = (path) => `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export default API_BASE_URL;
