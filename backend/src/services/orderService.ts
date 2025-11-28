import Order from '../models/Order';
import DiscountCode from '../models/DiscountCode';
import { clearCart } from './cartService';

/**
 * Calculate order number (next sequential number)
 */
const getNextOrderNumber = async (): Promise<number> => {
  const lastOrder = await Order.findOne().sort({ orderNumber: -1 });
  return lastOrder ? lastOrder.orderNumber + 1 : 1;
};

/**
 * Validate and apply discount code
 */
export const validateDiscountCode = async (
  code: string
): Promise<{ valid: boolean; discountPercent: number }> => {
  const discountCode = await DiscountCode.findOne({ code, isUsed: false });
  
  if (!discountCode) {
    return { valid: false, discountPercent: 0 };
  }
  
  return { valid: true, discountPercent: discountCode.discountPercent };
};

/**
 * Create a new order
 */
export const createOrder = async (
  userId: string,
  items: any[],
  discountCode?: string
): Promise<any> => {
  // Calculate subtotal
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
  let discountAmount = 0;
  let appliedDiscountCode = null;
  
  // Validate and apply discount code if provided
  if (discountCode) {
    const validation = await validateDiscountCode(discountCode);
    if (validation.valid) {
      discountAmount = (subtotal * validation.discountPercent) / 100;
      appliedDiscountCode = discountCode;
    }
  }
  
  const total = subtotal - discountAmount;
  const orderNumber = await getNextOrderNumber();
  
  // Create order
  const order = new Order({
    userId,
    items,
    subtotal,
    discountCode: appliedDiscountCode,
    discountAmount,
    total,
    orderNumber,
  });
  
  await order.save();
  
  // Mark discount code as used with order number (if applied)
  if (appliedDiscountCode) {
    await DiscountCode.updateOne(
      { code: appliedDiscountCode },
      { 
        isUsed: true, 
        usedAt: new Date(),
        usedByOrderNumber: orderNumber 
      }
    );
  }
  
  // Clear cart after successful checkout
  await clearCart(userId);
  
  return order;
};

/**
 * Get all orders (for admin stats)
 */
export const getAllOrders = async (): Promise<any[]> => {
  return await Order.find().sort({ createdAt: -1 });
};

