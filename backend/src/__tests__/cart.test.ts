import request from 'supertest';
import express from 'express';
import { setupTestDB, teardownTestDB, clearDatabase } from './setup';
import cartRoutes from '../routes/cartRoutes';
import Cart from '../models/Cart';
import { errorHandler } from '../middleware/errorHandler';

const app = express();
app.use(express.json());
app.use('/api/cart', cartRoutes);
app.use(errorHandler);

describe('Cart API', () => {
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

  describe('POST /api/cart/add', () => {
    it('should add item to cart', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .send({
          userId,
          productId: 'prod-1',
          name: 'Test Product',
          price: 99.99,
          quantity: 1,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.cart.items).toHaveLength(1);
      expect(response.body.cart.items[0].productId).toBe('prod-1');
    });

    it('should update quantity if item already exists', async () => {
      await request(app)
        .post('/api/cart/add')
        .send({
          userId,
          productId: 'prod-1',
          name: 'Test Product',
          price: 99.99,
          quantity: 2,
        });

      const response = await request(app)
        .post('/api/cart/add')
        .send({
          userId,
          productId: 'prod-1',
          name: 'Test Product',
          price: 99.99,
          quantity: 3,
        });

      expect(response.status).toBe(200);
      expect(response.body.cart.items[0].quantity).toBe(5);
    });

    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .send({
          userId,
          productId: 'prod-1',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/cart/:userId', () => {
    it('should get cart for user', async () => {
      await Cart.create({
        userId,
        items: [{ productId: 'prod-1', name: 'Test', price: 10, quantity: 1 }],
      });

      const response = await request(app).get(`/api/cart/${userId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.cart.items).toHaveLength(1);
    });

    it('should create empty cart if not exists', async () => {
      const response = await request(app).get(`/api/cart/${userId}`);

      expect(response.status).toBe(200);
      expect(response.body.cart.items).toHaveLength(0);
    });
  });
});

