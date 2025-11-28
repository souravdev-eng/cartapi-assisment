export interface AdminStats {
  itemsPurchased: number;
  totalPurchaseAmount: number;
  discountCodes: string[];
  totalDiscountAmount: number;
}

export interface Message {
  type: 'success' | 'error';
  text: string;
}

