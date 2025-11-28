import express, { Request, Response } from 'express';
import { addItemToCart, getCart } from '../services/cartService';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

/**
 * POST /api/cart/add - Add item to cart
 */
router.post('/add', asyncHandler(async (req: Request, res: Response) => {
  const { userId, productId, name, price, quantity } = req.body;
  
  if (!userId || !productId || !name || price === undefined || !quantity) {
    return res.status(400).json({
      error: 'Missing required fields: userId, productId, name, price, quantity',
    });
  }
  
  if (price <= 0 || quantity <= 0) {
    return res.status(400).json({
      error: 'Price and quantity must be greater than 0',
    });
  }
  
  const cart = await addItemToCart(userId, { productId, name, price, quantity });
  res.json({ success: true, cart });
}));

/**
 * GET /api/cart/:userId - Get cart for a user
 */
router.get('/:userId', asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const cart = await getCart(userId);
  res.json({ success: true, cart });
}));

export default router;

