import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage if available
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('flashfood_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('flashfood_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item, quantity = 1) => {
    const maxAvailable = item.quantityAvailable !== undefined ? item.quantityAvailable : (item.quantity ?? 99);
    if (maxAvailable <= 0) {
      return false;
    }
    setCartItems(prev => {
      const existingItem = prev.find(i => i._id === item._id);
      if (existingItem) {
        // Increase quantity up to available limit
        const newQuantity = Math.min(existingItem.cartQuantity + quantity, maxAvailable);
        return prev.map(i => i._id === item._id ? { ...i, cartQuantity: newQuantity, quantityAvailable: maxAvailable } : i);
      }
      const initialQuantity = Math.min(quantity, maxAvailable);
      return [...prev, { ...item, cartQuantity: initialQuantity, quantityAvailable: maxAvailable }];
    });
    return true;
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(i => i._id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prev => prev.map(i => {
      if (i._id === itemId) {
        // Ensure they don't add more than available
        const maxAvailable = i.quantityAvailable !== undefined ? i.quantityAvailable : (i.quantity ?? 99);
        return { ...i, cartQuantity: Math.min(newQuantity, maxAvailable) };
      }
      return i;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.discountedPrice * item.cartQuantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.cartQuantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
