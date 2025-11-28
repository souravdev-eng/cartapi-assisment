const CODE_PREFIX = 'DISCOUNT';

/**
 * Generate a random discount code
 */
export const generateRandomCode = (): string => {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${CODE_PREFIX}-${random}`;
};

/**
 * Check if order count is eligible for discount code generation
 */
export const isEligibleForDiscount = (totalOrders: number, nthOrder: number): boolean => {
    return totalOrders > 0 && totalOrders % nthOrder === 0;
};

/**
 * Get next eligible order number
 */
export const getNextEligibleOrder = (totalOrders: number, nthOrder: number): number => {
    return Math.ceil((totalOrders + 1) / nthOrder) * nthOrder;
};

