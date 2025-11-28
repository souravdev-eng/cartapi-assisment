import express, { Request, Response } from 'express';
import { generateDiscountCodeIfEligible } from '../services/discountService';
import { getAdminStats } from '../services/adminService';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

/**
 * POST /api/admin/generate-discount - Generate discount code if eligible
 */
router.post('/generate-discount', asyncHandler(async (req: Request, res: Response) => {
  const nthOrder = parseInt(process.env.NTH_ORDER || '5', 10);
  const result = await generateDiscountCodeIfEligible(nthOrder);

  if (result.generated) {
    res.json({ success: true, code: result.code, message: result.message });
  } else {
    res.status(400).json({ success: false, message: result.message });
  }
}));

/**
 * GET /api/admin/stats - Get admin statistics
 */
router.get('/stats', asyncHandler(async (req: Request, res: Response) => {
  const stats = await getAdminStats();
  res.json({ success: true, stats });
}));

export default router;

