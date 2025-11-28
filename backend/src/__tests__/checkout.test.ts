import request from 'supertest';
import express from 'express';
import { setupTestDB, teardownTestDB, clearDatabase } from './setup';
import checkoutRoutes from '../routes/checkoutRoutes';
import cartRoutes from '../routes/cartRoutes';
import Cart from '../models/Cart';
import DiscountCode from '../models/DiscountCode';
import { errorHandler } from '../middleware/errorHandler';

const app = express();
app.use(express.json());
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use(errorHandler);

describe('Checkout API', () => {
  const userId = 'test-user-123';

  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe('POST /api/checkout', () => {
    it('should create order without discount', async () => {
      await Cart.create({
        userId,
        items: [
          { productId: 'prod-1', name: 'Product 1', price: 100, quantity: 2 },
        ],
      });

      const response = await request(app)
        .post('/api/checkout')
        .send({ userId });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.order.subtotal).toBe(200);
      expect(response.body.order.total).toBe(200);
      expect(response.body.order.discountAmount).toBe(0);
    });

    it('should apply valid discount code', async () => {
      await Cart.create({
        userId,
        items: [{ productId: 'prod-1', name: 'Product 1', price: 100, quantity: 1 }],
      });

      await DiscountCode.create({
        code: 'DISCOUNT-TEST',
        discountPercent: 10,
        isUsed: false,
      });

      const response = await request(app)
        .post('/api/checkout')
        .send({ userId, discountCode: 'DISCOUNT-TEST' });

      expect(response.status).toBe(200);
      expect(response.body.order.discountCode).toBe('DISCOUNT-TEST');
      expect(response.body.order.discountAmount).toBe(10);
      expect(response.body.order.total).toBe(90);
    });

    it('should ignore invalid discount code', async () => {
      await Cart.create({
        userId,
        items: [{ productId: 'prod-1', name: 'Product 1', price: 100, quantity: 1 }],
      });

      const response = await request(app)
        .post('/api/checkout')
        .send({ userId, discountCode: 'INVALID-CODE' });

      expect(response.status).toBe(200);
      expect(response.body.order.discountCode).toBeNull();
      expect(response.body.order.total).toBe(100);
    });

    it('should return 400 for empty cart', async () => {
      const response = await request(app)
        .post('/api/checkout')
        .send({ userId });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Cart is empty');
    });
  });

  describe('POST /api/checkout/validate-discount', () => {
    it('should validate valid discount code', async () => {
      await DiscountCode.create({
        code: 'DISCOUNT-VALID',
        discountPercent: 10,
        isUsed: false,
      });

      const response = await request(app)
        .post('/api/checkout/validate-discount')
        .send({ code: 'DISCOUNT-VALID' });

      expect(response.status).toBe(200);
      expect(response.body.valid).toBe(true);
      expect(response.body.discountPercent).toBe(10);
    });

    it('should reject invalid discount code', async () => {
      const response = await request(app)
        .post('/api/checkout/validate-discount')
        .send({ code: 'INVALID-CODE' });

      expect(response.status).toBe(200);
      expect(response.body.valid).toBe(false);
    });
  });
});

