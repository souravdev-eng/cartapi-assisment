export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartProps {
  userId: string;
  onCheckout: () => void;
}

export interface Cart {
  items: CartItem[];
}

