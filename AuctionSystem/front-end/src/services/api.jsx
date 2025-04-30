import axios from "axios";

const API_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  register: (userData) => api.post("/register", userData),
  login: (credentials) => api.post("/login", credentials),
  logout: () => api.post("/logout"),
  getCurrentUser: () => api.get("/user"),
};

export const productService = {
  getProducts: (params) => api.get("/products", { params }),
  getProduct: (id) => api.get(`/products/${id}`),
};

export const categoryService = {
  getCategories: () => api.get("/categories"),
};

export const cartService = {
  getCart: () => api.get("/cart"),
  addToCart: (productId, quantity) =>
    api.post("/cart", { product_id: productId, quantity }),
  updateCartItem: (id, quantity) => api.put(`/cart/${id}`, { quantity }),
  removeFromCart: (id) => api.delete(`/cart/${id}`),
  clearCart: () => api.delete("/cart"),
};

export const orderService = {
  getOrders: () => api.get("/orders"),
  getOrder: (id) => api.get(`/orders/${id}`),
  createOrder: (data) => api.post("/orders", data),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
};

export default api;
