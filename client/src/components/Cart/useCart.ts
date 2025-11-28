import { useState, useEffect, useCallback } from 'react';
import { cartApi } from '../../api/api';
import { Cart, CartItem } from './types';

export const useCart = (userId: string) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCart = useCallback(async () => {
    try {
      const response = await cartApi.getCart(userId);
      setCart(response.cart);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const calculateTotal = (): number => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce(
      (sum: number, item: CartItem) => sum + item.price * item.quantity,
      0
    );
  };

  return {
    cart,
    loading,
    calculateTotal,
  };
};

