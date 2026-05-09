import { create } from 'zustand';

export const useToast = create((set) => ({
  message: '',
  visible: false,
  showToast: (message) => {
    set({ message, visible: true });
    setTimeout(() => {
      set({ visible: false });
    }, 2000);
  },
  hideToast: () => set({ visible: false })
}));
