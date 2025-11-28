import React from 'react';
import { useAdminDashboard } from './useAdminDashboard';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const { stats, loading, message, loadStats, handleGenerateDiscount } = useAdminDashboard();

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      
      {message && (
        <div className={`admin-message admin-message-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="admin-actions">
        <button
          className="generate-discount-btn"
          onClick={handleGenerateDiscount}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Generate Discount Code'}
        </button>
        <button
          className="refresh-stats-btn"
          onClick={loadStats}
          disabled={loading}
        >
          Refresh Stats
        </button>
      </div>

      {loading && !stats ? (
        <div className="admin-loading">Loading statistics...</div>
      ) : stats ? (
        <div className="admin-stats">
          <div className="stat-card">
            <h3>Items Purchased</h3>
            <p className="stat-value">{stats.itemsPurchased}</p>
          </div>
          
          <div className="stat-card">
            <h3>Total Purchase Amount</h3>
            <p className="stat-value">${stats.totalPurchaseAmount.toFixed(2)}</p>
          </div>
          
          <div className="stat-card">
            <h3>Total Discount Amount</h3>
            <p className="stat-value">${stats.totalDiscountAmount.toFixed(2)}</p>
          </div>
          
          <div className="stat-card stat-card-full">
            <h3>Discount Codes</h3>
            {stats.discountCodes.length > 0 ? (
              <div className="discount-codes-list">
                {stats.discountCodes.map((code, index) => (
                  <span key={index} className="discount-code-badge">
                    {code}
                  </span>
                ))}
              </div>
            ) : (
              <p className="no-codes">No discount codes generated yet</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminDashboard;

