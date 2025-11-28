import express, { Request, Response } from 'express';
import { createOrder, validateDiscountCode } from '../services/orderService';
import { getCart } from '../services/cartService';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

/**
 * POST /api/checkout/validate-discount - Validate discount code
 */
router.post('/validate-discount', asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'Discount code is required' });
  }
  
  const validation = await validateDiscountCode(code);
  res.json({
    success: true,
    valid: validation.valid,
    discountPercent: validation.discountPercent,
  });
}));

/**
 * POST /api/checkout - Create order
 */
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const { userId, discountCode } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'UserId is required' });
  }
  
  const cart = await getCart(userId);
  
  if (!cart.items || cart.items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  
  const order = await createOrder(userId, cart.items, discountCode);
  
  res.json({
    success: true,
    order: {
      orderId: order._id,
      orderNumber: order.orderNumber,
      items: order.items,
      subtotal: order.subtotal,
      discountCode: order.discountCode,
      discountAmount: order.discountAmount,
      total: order.total,
      createdAt: order.createdAt,
    },
  });
}));

export default router;
