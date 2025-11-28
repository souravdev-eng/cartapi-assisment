import DiscountCode from '../models/DiscountCode';
import Order from '../models/Order';
import {
  generateRandomCode,
  isEligibleForDiscount,
  getNextEligibleOrder,
} from '../utils/discountUtils';

const DISCOUNT_PERCENT = 10;
const MAX_CODE_GENERATION_ATTEMPTS = 10;

/**
 * Generate a unique discount code that doesn't exist in database
 */
const generateUniqueCode = async (): Promise<string | null> => {
  for (let attempt = 0; attempt < MAX_CODE_GENERATION_ATTEMPTS; attempt++) {
    const code = generateRandomCode();
    const exists = await DiscountCode.findOne({ code });
    if (!exists) return code;
  }
  return null;
};

/**
 * Generate discount code if nth order condition is met
 */
export const generateDiscountCodeIfEligible = async (nthOrder: number) => {
  const totalOrders = await Order.countDocuments();

  if (!isEligibleForDiscount(totalOrders, nthOrder)) {
    const nextOrder = getNextEligibleOrder(totalOrders, nthOrder);
    return {
      generated: false,
      message: `Not eligible. Current order count: ${totalOrders}. Next discount code will be generated at order ${nextOrder}`,
    };
  }

  const existingCode = await DiscountCode.findOne({
    orderNumber: totalOrders,
    isUsed: false,
  });

  if (existingCode) {
    return {
      generated: false,
      message: `Discount code already exists for order ${totalOrders}: ${existingCode.code}`,
    };
  }

  const code = await generateUniqueCode();
  if (!code) {
    return {
      generated: false,
      message: 'Failed to generate unique discount code',
    };
  }

  await DiscountCode.create({
    code,
    discountPercent: DISCOUNT_PERCENT,
    isUsed: false,
    orderNumber: totalOrders,
  });

  return {
    generated: true,
    code,
    message: `Discount code generated successfully for order ${totalOrders}`,
  };
};

/**
 * Get all discount codes
 */
export const getAllDiscountCodes = async () => {
  return await DiscountCode.find().sort({ createdAt: -1 });
};

