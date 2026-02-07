import { create } from 'zustand';

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  rental_start_date?: string;
  rental_end_date?: string;
  products?: {
    id: string;
    name: string;
    description: string;
    category: string;
    rental_price_per_day: number;
    purchase_price?: number;
    image_url: string;
    available: boolean;
  };
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  setItems: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,

  setItems: (items) => set({ items }),

  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.product_id === item.product_id);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.product_id === item.product_id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    })),

  clearCart: () => set({ items: [] }),

  openCart: () => set({ isOpen: true }),

  closeCart: () => set({ isOpen: false }),

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  getItemCount: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    const { items } = get();
    return items.reduce((total, item) => {
      if (!item.products) return total;

      const itemPrice = item.products.rental_price_per_day;

      // Calculate rental days if dates provided
      let days = 1;
      if (item.rental_start_date && item.rental_end_date) {
        const start = new Date(item.rental_start_date);
        const end = new Date(item.rental_end_date);
        days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
      }

      return total + (itemPrice * days * item.quantity);
    }, 0);
  },
}));
