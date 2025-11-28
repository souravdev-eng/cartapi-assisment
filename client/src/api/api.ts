import axios from 'axios';

declare const process: {
  env: {
    REACT_APP_API_URL?: string;
  };
};

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Cart API functions
 */
export const cartApi = {
  addItem: async (userId: string, productId: string, name: string, price: number, quantity: number) => {
    const response = await api.post('/api/cart/add', {
      userId,
      productId,
      name,
      price,
      quantity,
    });
    return response.data;
  },

  getCart: async (userId: string) => {
    const response = await api.get(`/api/cart/${userId}`);
    return response.data;
  },
};

/**
 * Checkout API functions
 */
export const checkoutApi = {
  validateDiscount: async (code: string) => {
    const response = await api.post('/api/checkout/validate-discount', {
      code,
    });
    return response.data;
  },

  checkout: async (userId: string, discountCode?: string) => {
    const response = await api.post('/api/checkout', {
      userId,
      discountCode,
    });
    return response.data;
  },
};

/**
 * Admin API functions
 */
export const adminApi = {
  generateDiscount: async () => {
    const response = await api.post('/api/admin/generate-discount');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/api/admin/stats');
    return response.data;
  },
};

export default api;

