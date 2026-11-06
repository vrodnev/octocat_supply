import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

export interface CartItem {
  productId: number;
  name: string;
  imgName: string;
  unitPrice: number;
  quantity: number;
}

export const SHIPPING_FLAT_RATE = 10;
export const COUPON_CODE = 'OCTOCAT5';
export const COUPON_DISCOUNT_RATE = 0.05;
const STORAGE_KEY = 'octocat-cart';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discountRate: number;
  discount: number;
  shipping: number;
  grandTotal: number;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
}

const CartContext = createContext<CartContextType | null>(null);

function loadItems(): CartItem[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadItems);
  const [discountRate, setDiscountRate] = useState(0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextType>(() => {
    const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const discount = subtotal * discountRate;
    const shipping = items.length > 0 ? SHIPPING_FLAT_RATE : 0;

    return {
      items,
      itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal,
      discountRate,
      discount,
      shipping,
      grandTotal: subtotal - discount + shipping,
      addItem: (item, quantity = 1) => {
        if (quantity < 1) {return;}
        setItems((prev) =>
          prev.some((i) => i.productId === item.productId)
            ? prev.map((i) =>
                i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i,
              )
            : [...prev, { ...item, quantity }],
        );
      },
      updateQuantity: (productId, quantity) =>
        setItems((prev) =>
          quantity < 1
            ? prev.filter((i) => i.productId !== productId)
            : prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
        ),
      removeItem: (productId) => setItems((prev) => prev.filter((i) => i.productId !== productId)),
      clearCart: () => {
        setItems([]);
        setDiscountRate(0);
      },
      applyCoupon: (code) => {
        const valid = code.trim().toUpperCase() === COUPON_CODE;
        if (valid) {setDiscountRate(COUPON_DISCOUNT_RATE);}
        return valid;
      },
    };
  }, [items, discountRate]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
