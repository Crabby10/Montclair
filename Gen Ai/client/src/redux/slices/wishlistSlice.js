import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wishlistItems: localStorage.getItem('wishlistItems')
    ? JSON.parse(localStorage.getItem('wishlistItems'))
    : []
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const existIdx = state.wishlistItems.findIndex((x) => x.id === product.id);

      if (existIdx > -1) {
        // Remove if exists
        state.wishlistItems = state.wishlistItems.filter((x) => x.id !== product.id);
      } else {
        // Add if not exists
        state.wishlistItems.push(product);
      }
      localStorage.setItem('wishlistItems', JSON.stringify(state.wishlistItems));
    },
    removeFromWishlist: (state, action) => {
      const id = action.payload;
      state.wishlistItems = state.wishlistItems.filter((x) => x.id !== id);
      localStorage.setItem('wishlistItems', JSON.stringify(state.wishlistItems));
    }
  }
});

export const { toggleWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
