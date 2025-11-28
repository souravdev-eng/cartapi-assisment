import request from 'supertest';
import express from 'express';
import { setupTestDB, teardownTestDB, clearDatabase } from './setup';
import adminRoutes from '../routes/adminRoutes';
import Order from '../models/Order';
import DiscountCode from '../models/DiscountCode';
import { errorHandler } from '../middleware/errorHandler';

const app = express();
app.use(express.json());
app.use('/api/admin', adminRoutes);
app.use(errorHandler);

describe('Admin API', () => {
  beforeAll(async () => {
    await setupTestDB();
    process.env.NTH_ORDER = '5';
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe('POST /api/admin/generate-discount', () => {
    it('should generate discount code at nth order', async () => {
      // Create 5 orders
      for (let i = 1; i <= 5; i++) {
        await Order.create({
          userId: `user-${i}`,
          items: [{ productId: 'prod-1', name: 'Product', price: 10, quantity: 1 }],
          subtotal: 10,
          discountAmount: 0,
          total: 10,
          orderNumber: i,
        });
      }

      const response = await request(app)
        .post('/api/admin/generate-discount');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.code).toBeDefined();
      expect(response.body.code).toMatch(/^DISCOUNT-/);
    });

    it('should not generate code if not at nth order', async () => {
      await Order.create({
        userId: 'user-1',
        items: [{ productId: 'prod-1', name: 'Product', price: 10, quantity: 1 }],
        subtotal: 10,
        discountAmount: 0,
        total: 10,
        orderNumber: 1,
      });

      const response = await request(app)
        .post('/api/admin/generate-discount');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/admin/stats', () => {
    it('should return admin statistics', async () => {
      await Order.create({
        userId: 'user-1',
        items: [
          { productId: 'prod-1', name: 'Product 1', price: 100, quantity: 2 },
          { productId: 'prod-2', name: 'Product 2', price: 50, quantity: 1 },
        ],
        subtotal: 250,
        discountCode: 'DISCOUNT-TEST',
        discountAmount: 25,
        total: 225,
        orderNumber: 1,
      });

      await DiscountCode.create({
        code: 'DISCOUNT-TEST',
        discountPercent: 10,
        isUsed: true,
      });

      const response = await request(app).get('/api/admin/stats');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.stats.itemsPurchased).toBe(3);
      expect(response.body.stats.totalPurchaseAmount).toBe(250);
      expect(response.body.stats.totalDiscountAmount).toBe(25);
      expect(response.body.stats.discountCodes).toContain('DISCOUNT-TEST');
    });
  });
});

