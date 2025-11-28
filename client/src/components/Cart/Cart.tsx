import React from 'react';
import { useCart } from './useCart';
import { CartProps, CartItem } from './types';
import './Cart.css';

const Cart: React.FC<CartProps> = ({ userId, onCheckout }) => {
  const { cart, loading, calculateTotal } = useCart(userId);

  if (loading) {
    return <div className="cart-loading">Loading cart...</div>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your Cart</h2>
        <p>Your cart is empty. Start shopping!</p>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cart.items.map((item: CartItem, index: number) => (
          <div key={index} className="cart-item">
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p className="cart-item-price">${item.price.toFixed(2)} each</p>
            </div>
            <div className="cart-item-quantity">
              <span>Qty: {item.quantity}</span>
            </div>
            <div className="cart-item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="cart-total">
          <strong>Total: ${calculateTotal().toFixed(2)}</strong>
        </div>
        <button className="checkout-btn" onClick={onCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;

