import { useState } from 'react';
import { cartApi } from '../../api/api';
import { Product, Message } from './types';

export const useProductList = (userId: string) => {
    const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
    const [message, setMessage] = useState<Message | null>(null);

    const addToCart = async (product: Product) => {
        setLoading((prev) => ({ ...prev, [product.id]: true }));
        setMessage(null);

        try {
            await cartApi.addItem(userId, product.id, product.name, product.price, 1);
            setMessage({ type: 'success', text: `${product.name} added to cart!` });
            setTimeout(() => setMessage(null), 3000);
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.error || 'Failed to add item to cart',
            });
            setTimeout(() => setMessage(null), 3000);
        } finally {
            setLoading((prev) => ({ ...prev, [product.id]: false }));
        }
    };

    return {
        loading,
        message,
        addToCart,
    };
};

