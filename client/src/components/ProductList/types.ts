export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface ProductListProps {
  userId: string;
}

export interface Message {
  type: 'success' | 'error';
  text: string;
}

