import { create } from 'zustand';

export const useWishlist = create((set, get) => ({
  productIds: [],
  fetchWishlist: async (token) => {
    try {
      const res = await fetch('http://localhost:5000/api/wishlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data && data.productIds) {
        set({ productIds: data.productIds.map(p => typeof p === 'string' ? p : p._id) });
      }
    } catch (err) {
      console.error(err);
    }
  },
  toggleWishlist: async (productId, token) => {
    if (!token) {
      window.location.href = '/login';
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/wishlist/${productId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data && data.productIds) {
        set({ productIds: data.productIds.map(id => id.toString()) });
      }
    } catch (err) {
      console.error('Wishlist Toggle Error:', err);
      alert('Could not update wishlist. Are you logged in?');
    }
  },
  isWishlisted: (productId) => {
    return get().productIds.map(id => id.toString()).includes(productId.toString());
  }
}));
