import { useState, useEffect } from 'react';
import { adminApi } from '../../api/api';
import { AdminStats, Message } from './types';

export const useAdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getStats();
      setStats(response.stats);
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to load stats',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDiscount = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await adminApi.generateDiscount();
      if (response.success) {
        setMessage({
          type: 'success',
          text: `Discount code generated: ${response.code}`,
        });
        loadStats();
      } else {
        setMessage({
          type: 'error',
          text: response.message || 'Failed to generate discount code',
        });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to generate discount code',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    message,
    loadStats,
    handleGenerateDiscount,
  };
};

