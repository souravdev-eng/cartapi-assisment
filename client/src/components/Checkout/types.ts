export interface CheckoutProps {
  userId: string;
}

export interface Order {
  orderId: string;
  orderNumber: number;
  items: any[];
  subtotal: number;
  discountCode: string | null;
  discountAmount: number;
  total: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
}

