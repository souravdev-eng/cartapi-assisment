import React from 'react';
import { useCheckout } from './useCheckout';
import { CheckoutProps } from './types';
import './Checkout.css';

const Checkout: React.FC<CheckoutProps> = ({ userId }) => {
  const {
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
  } = useCheckout(userId);

  if (order) {
    return (
      <div className="checkout-success">
        <h2>Order Placed Successfully!</h2>
        <div className="order-details">
          <p><strong>Order Number:</strong> #{order.orderNumber}</p>
          <p><strong>Subtotal:</strong> ${order.subtotal.toFixed(2)}</p>
          {order.discountCode && (
            <>
              <p><strong>Discount Code:</strong> {order.discountCode}</p>
              <p><strong>Discount Amount:</strong> ${order.discountAmount.toFixed(2)}</p>
            </>
          )}
          <p className="order-total"><strong>Total:</strong> ${order.total.toFixed(2)}</p>
        </div>
        <button
          className="continue-shopping-btn"
          onClick={() => window.location.reload()}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Checkout</h2>
        <p>Your cart is empty. Add items to cart first.</p>
      </div>
    );
  }

  const subtotal = calculateSubtotal();

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      {error && <div className="checkout-error">{error}</div>}
      
      <div className="checkout-summary">
        <div className="checkout-items">
          <h3>Order Summary</h3>
          {cart.items.map((item, index: number) => (
            <div key={index} className="checkout-item">
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="discount-section">
          <label htmlFor="discount-code">Discount Code (optional)</label>
          <div className="discount-input-wrapper">
            <input
              id="discount-code"
              type="text"
              value={discountCode}
              onChange={(e) => handleDiscountCodeChange(e.target.value.toUpperCase())}
              placeholder="Enter discount code"
              className={`discount-input ${discountValid === true ? 'valid' : discountValid === false ? 'invalid' : ''}`}
            />
            {validatingDiscount && <span className="validating-indicator">Validating...</span>}
            {discountValid === true && <span className="discount-valid">✓ Valid code</span>}
            {discountValid === false && discountCode && <span className="discount-invalid">✗ Invalid code</span>}
          </div>
        </div>

        <div className="checkout-totals">
          <div className="checkout-row">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discountValid && calculateDiscount() > 0 && (
            <div className="checkout-row discount-row">
              <span>Discount ({discountPercent}%):</span>
              <span className="discount-amount">-${calculateDiscount().toFixed(2)}</span>
            </div>
          )}
          <div className="checkout-row checkout-total">
            <span><strong>Total:</strong></span>
            <span><strong>${calculateTotal().toFixed(2)}</strong></span>
          </div>
        </div>

        <button
          className="place-order-btn"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;

