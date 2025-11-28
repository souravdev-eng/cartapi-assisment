import { getAllOrders } from './orderService';
import { getAllDiscountCodes } from './discountService';

/**
 * Get admin statistics
 */
export const getAdminStats = async () => {
  const [orders, discountCodes] = await Promise.all([
    getAllOrders(),
    getAllDiscountCodes(),
  ]);
  
  const itemsPurchased = orders.reduce(
    (sum, order) => sum + order.items.reduce((itemSum: number, item: any) => itemSum + item.quantity, 0),
    0
  );
  
  const totalPurchaseAmount = orders.reduce((sum, order) => sum + order.subtotal, 0);
  const totalDiscountAmount = orders.reduce((sum, order) => sum + order.discountAmount, 0);
  
  return {
    itemsPurchased,
    totalPurchaseAmount,
    discountCodes: discountCodes.map((dc) => dc.code),
    totalDiscountAmount,
  };
};

