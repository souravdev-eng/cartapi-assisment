import React, { useState } from 'react';
import './App.css';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'shop' | 'cart' | 'checkout' | 'admin'>('shop');
  const [userId] = useState<string>('user-' + Math.random().toString(36).substring(7));

  return (
    <div className="app">
      <header className="app-header">
        <h1>E-commerce Store</h1>
        <nav className="app-nav">
          <button
            className={activeView === 'shop' ? 'active' : ''}
            onClick={() => setActiveView('shop')}
          >
            Shop
          </button>
          <button
            className={activeView === 'cart' ? 'active' : ''}
            onClick={() => setActiveView('cart')}
          >
            Cart
          </button>
          <button
            className={activeView === 'checkout' ? 'active' : ''}
            onClick={() => setActiveView('checkout')}
          >
            Checkout
          </button>
          <button
            className={activeView === 'admin' ? 'active' : ''}
            onClick={() => setActiveView('admin')}
          >
            Admin
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeView === 'shop' && <ProductList userId={userId} />}
        {activeView === 'cart' && <Cart userId={userId} onCheckout={() => setActiveView('checkout')} />}
        {activeView === 'checkout' && <Checkout userId={userId} />}
        {activeView === 'admin' && <AdminDashboard />}
      </main>
    </div>
  );
};

export default App;

