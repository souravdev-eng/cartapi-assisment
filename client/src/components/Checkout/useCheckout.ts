import { useState, useEffect, useCallback } from 'react';
import { checkoutApi, cartApi } from '../../api/api';
import { Cart, Order, CartItem } from './types';

export const useCheckout = (userId: string) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [discountCode, setDiscountCode] = useState('');
  const [discountValid, setDiscountValid] = useState<boolean | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [validatingDiscount, setValidatingDiscount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCart = useCallback(async () => {
    try {
      const response = await cartApi.getCart(userId);
      setCart(response.cart);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }, [userId]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const calculateSubtotal = (): number => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce(
      (sum: number, item: CartItem) => sum + item.price * item.quantity,
      0
    );
  };

  const handleDiscountCodeChange = async (code: string) => {
    setDiscountCode(code);
    setDiscountValid(null);
    setDiscountPercent(0);

    if (code.trim().length > 0) {
      setValidatingDiscount(true);
      try {
        const response = await checkoutApi.validateDiscount(code);
        setDiscountValid(response.valid);
        setDiscountPercent(response.discountPercent);
      } catch (error) {
        setDiscountValid(false);
        setDiscountPercent(0);
      } finally {
        setValidatingDiscount(false);
      }
    }
  };

  const calculateDiscount = (): number => {
    if (discountValid && discountPercent > 0) {
      const subtotal = calculateSubtotal();
      return (subtotal * discountPercent) / 100;
    }
    return 0;
  };

  const calculateTotal = (): number => {
    return calculateSubtotal() - calculateDiscount();
  };

  const handleCheckout = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      setError('Cart is empty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await checkoutApi.checkout(
        userId,
        discountCode || undefined
      );
      setOrder(response.order);
    } catch (error: any) {
      setError(
        error.response?.data?.error || 'Failed to complete checkout'
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    cart,
    discountCode,
    discountValid,
    discountPercent,
    validatingDiscount,
    loading,
    order,
    error,
    calculateSubtotal,
    calculateDiscount,
    calculateTotal,
    handleDiscountCodeChange,
    handleCheckout,
  };
};

