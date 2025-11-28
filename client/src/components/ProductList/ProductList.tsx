import React from 'react';
import { useProductList } from './useProductList';
import { Product, ProductListProps } from './types';
import './ProductList.css';

const PRODUCTS: Product[] = [
  { id: '1', name: 'Laptop', price: 999.99, description: 'High-performance laptop' },
  { id: '2', name: 'Smartphone', price: 699.99, description: 'Latest smartphone model' },
  { id: '3', name: 'Headphones', price: 199.99, description: 'Wireless noise-cancelling headphones' },
  { id: '4', name: 'Keyboard', price: 79.99, description: 'Mechanical gaming keyboard' },
  { id: '5', name: 'Mouse', price: 49.99, description: 'Ergonomic wireless mouse' },
  { id: '6', name: 'Monitor', price: 299.99, description: '27-inch 4K monitor' },
];

const ProductList: React.FC<ProductListProps> = ({ userId }) => {
  const { loading, message, addToCart } = useProductList(userId);

  return (
    <div className="product-list">
      <h2>Products</h2>
      {message && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}
      <div className="products-grid">
        {PRODUCTS.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">${product.price.toFixed(2)}</p>
            </div>
            <button
              className="add-to-cart-btn"
              onClick={() => addToCart(product)}
              disabled={loading[product.id]}
            >
              {loading[product.id] ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;

