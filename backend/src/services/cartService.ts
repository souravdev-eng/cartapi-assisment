import Cart, { ICartItem } from '../models/Cart';

/**
 * Get or create cart for a user
 */
export const getOrCreateCart = async (userId: string): Promise<any> => {
  let cart = await Cart.findOne({ userId });
  
  if (!cart) {
    cart = new Cart({ userId, items: [] });
    await cart.save();
  }
  
  return cart;
};

/**
 * Add item to cart
 */
export const addItemToCart = async (
  userId: string,
  item: ICartItem
): Promise<any> => {
  const cart = await getOrCreateCart(userId);
  
  // Check if item already exists in cart
  const existingItemIndex = cart.items.findIndex(
    (cartItem: ICartItem) => cartItem.productId === item.productId
  );
  
  if (existingItemIndex >= 0) {
    // Update quantity if item exists
    cart.items[existingItemIndex].quantity += item.quantity;
  } else {
    // Add new item
    cart.items.push(item);
  }
  
  await cart.save();
  return cart;
};

/**
 * Get cart for a user
 */
export const getCart = async (userId: string): Promise<any> => {
  return await getOrCreateCart(userId);
};

/**
 * Clear cart after checkout
 */
export const clearCart = async (userId: string): Promise<void> => {
  const cart = await getOrCreateCart(userId);
  cart.items = [];
  await cart.save();
};

