import { create } from 'zustand';

export const useCart = create((set, get) => ({
  items: [],
  addItem: (product) => {
    const items = get().items;
    const existing = items.find(item => item.productId === product._id);
    if (existing) {
      set({ items: items.map(item => item.productId === product._id ? { ...item, quantity: item.quantity + 1 } : item) });
    } else {
      set({ items: [...items, { 
        productId: product._id, 
        vendorId: product.vendorId._id || product.vendorId, 
        title: product.name, 
        priceAtPurchase: product.price, 
        quantity: 1 
      }] });
    }
  },
  increaseQty: (productId) => {
    const items = get().items;
    set({ items: items.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item) });
  },
  decreaseQty: (productId) => {
    const items = get().items;
    const item = items.find(i => i.productId === productId);
    if (item.quantity > 1) {
      set({ items: items.map(i => i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i) });
    } else {
      get().removeItem(productId);
    }
  },
  setQty: (productId, qty) => {
    if (qty <= 0) {
      get().removeItem(productId);
    } else {
      const items = get().items;
      set({ items: items.map(i => i.productId === productId ? { ...i, quantity: qty } : i) });
    }
  },
  removeItem: (productId) => {
    set({ items: get().items.filter(item => item.productId !== productId) });
  },
  clearCart: () => set({ items: [] }),
  total: () => get().items.reduce((acc, item) => acc + (item.priceAtPurchase * item.quantity), 0)
}));
