import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
  subTotal: 0,
  shippingFee: 0,
  totalAmount: 0
};

// Helper to calculate pricing totals
const recalculateTotals = (state) => {
  state.subTotal = state.cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  state.shippingFee = state.subTotal >= 150 ? 0 : 15;
  state.totalAmount = state.subTotal + state.shippingFee;
  localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItemIdx = state.cartItems.findIndex(
        (x) => x.id === item.id && x.size === item.size && x.color === item.color
      );

      if (existItemIdx > -1) {
        state.cartItems[existItemIdx].quantity += item.quantity || 1;
      } else {
        state.cartItems.push({ ...item, quantity: item.quantity || 1 });
      }

      recalculateTotals(state);
    },
    removeFromCart: (state, action) => {
      const idx = action.payload;
      state.cartItems = state.cartItems.filter((_, i) => i !== idx);
      recalculateTotals(state);
    },
    updateCartQuantity: (state, action) => {
      const { idx, quantity } = action.payload;
      if (state.cartItems[idx]) {
        state.cartItems[idx].quantity = quantity;
      }
      recalculateTotals(state);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.subTotal = 0;
      state.shippingFee = 0;
      state.totalAmount = 0;
      localStorage.removeItem('cartItems');
    }
  }
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
