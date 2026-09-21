"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItemType {
  id: string; // product id or unique cart item id
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  mrp: number;
  quantity: number;
  variantName?: string;
}

interface CartContextType {
  items: CartItemType[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: {
    id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    mrp: number;
    variantName?: string;
  }, quantity?: number) => void;
  updateQuantity: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  freeDeliveryThreshold: number;
  amountNeededForFreeDelivery: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(0);

  const freeDeliveryThreshold = 499;

  // Load from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("townkart_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      } else {
        // Initial sample item for preview
        setItems([
          {
            id: "sample-1",
            productId: "seed-headphones",
            name: "TownKart Studio Wireless Headphones",
            slug: "townkart-studio-wireless-headphones",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
            price: 1499,
            mrp: 1899,
            quantity: 1,
            variantName: "Midnight Black",
          },
        ]);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem("townkart_cart", JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addToCart = (product: {
    id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    mrp: number;
    variantName?: string;
  }, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === product.id && i.variantName === product.variantName
      );
      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          id: `${product.id}-${Date.now()}`,
          productId: product.id,
          name: product.name,
          slug: product.slug,
          image: product.image,
          price: product.price,
          mrp: product.mrp,
          quantity,
          variantName: product.variantName,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setDiscount(0);
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = subtotal === 0 || subtotal >= freeDeliveryThreshold ? 0 : 30;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const total = Math.max(0, subtotal + deliveryFee - discount);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === "WELCOME10") {
      if (subtotal < 299) {
        return { success: false, message: "Minimum cart value for WELCOME10 is ₹299" };
      }
      const disc = Math.min(150, Math.round(subtotal * 0.1));
      setAppliedCoupon(clean);
      setDiscount(disc);
      return { success: true, message: `Applied! You saved ₹${disc}` };
    }
    if (clean === "SAVE100") {
      if (subtotal < 999) {
        return { success: false, message: "Minimum cart value for SAVE100 is ₹999" };
      }
      setAppliedCoupon(clean);
      setDiscount(100);
      return { success: true, message: "Applied! You saved ₹100" };
    }
    if (clean === "TOWNEXPRESS") {
      if (subtotal < 499) {
        return { success: false, message: "Minimum cart value for TOWNEXPRESS is ₹499" };
      }
      setAppliedCoupon(clean);
      setDiscount(50);
      return { success: true, message: "Applied! You saved ₹50" };
    }
    return { success: false, message: "Invalid coupon code. Try WELCOME10 or SAVE100" };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        deliveryFee,
        discount,
        total,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        freeDeliveryThreshold,
        amountNeededForFreeDelivery,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
