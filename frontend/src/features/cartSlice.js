import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? { ...x, qty: x.qty + 1 } : x
        );
      } else {
        state.cartItems = [...state.cartItems, { ...item, qty: 1 }];
      }
      
      // Calculate total
      state.totalAmount = state.cartItems.reduce((acc, item) => acc + item.discountedPrice * item.qty, 0);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      state.totalAmount = state.cartItems.reduce((acc, item) => acc + item.discountedPrice * item.qty, 0);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
    }
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
