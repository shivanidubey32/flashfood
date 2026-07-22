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
    setCartItems(prev => {
      const existingItem = prev.find(i => i._id === item._id);
      if (existingItem) {
        // Increase quantity up to available limit
        const newQuantity = Math.min(existingItem.cartQuantity + quantity, item.quantity);
        return prev.map(i => i._id === item._id ? { ...i, cartQuantity: newQuantity } : i);
      }
      return [...prev, { ...item, cartQuantity: quantity }];
    });
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
        return { ...i, cartQuantity: Math.min(newQuantity, i.quantity || 99) };
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
