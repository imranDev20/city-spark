"use client";
import { createContext, ReactNode, useContext, useState } from "react";

// Define the product type
type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
};

// Define the CartContextType to include the new functions
interface CartContextType {
  collectionCart: Product[];
  addToCollectionCart: (product: Product) => void;
  increaseCollectionQuantity: (productId: string) => void;
  decreaseCollectionQuantity: (productId: string) => void;
}
interface CartContextType {
  deliveryCart: Product[];
  addToDeliveryCart: (product: Product) => void;
  increaseDeliveryQuantity: (productId: string) => void;
  decreaseDeliveryQuantity: (productId: string) => void;
}

// Initialize the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart Provider Component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [collectionCart, setCollectionCart] = useState<Product[]>([]);
  const [deliveryCart, setDeliveryCart] = useState<Product[]>([]);

  const addToCollectionCart = (product: Product) => {
    setCollectionCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);

      if (existingProduct) {
        // Calculate the new quantity, ensuring it does not exceed the stock
        const newQuantity = Math.min(
          existingProduct.quantity + product.quantity,
          product.stock
        );

        // Update the cart with the new quantity
        const updatedCart = prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
        return updatedCart;
      } else {
        // Ensure the product's initial quantity does not exceed stock
        const initialQuantity = Math.min(product.quantity, product.stock);

        // Add the product as a new entry
        return [...prevCart, { ...product, quantity: initialQuantity }];
      }
    });
  };
  const addToDeliveryCart = (product: Product) => {
    setDeliveryCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);

      if (existingProduct) {
        // Calculate the new quantity, ensuring it does not exceed the stock
        const newQuantity = Math.min(
          existingProduct.quantity + product.quantity,
          product.stock
        );

        // Update the cart with the new quantity
        const updatedCart = prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
        return updatedCart;
      } else {
        // Ensure the product's initial quantity does not exceed stock
        const initialQuantity = Math.min(product.quantity, product.stock);

        // Add the product as a new entry
        return [
          ...prevCart,
          { ...product, quantity: initialQuantity, cartType: "delivery" },
        ];
      }
    });
  };

  const increaseCollectionQuantity = (productId: string) => {
    setCollectionCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.id === productId && item.quantity < item.stock) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
    });
  };
  const increaseDeliveryQuantity = (productId: string) => {
    setDeliveryCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.id === productId && item.quantity < item.stock) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
    });
  };

  const decreaseCollectionQuantity = (productId: string) => {
    setCollectionCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };
  const decreaseDeliveryQuantity = (productId: string) => {
    setDeliveryCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        collectionCart,
        deliveryCart,
        addToCollectionCart,
        addToDeliveryCart,
        increaseDeliveryQuantity,
        decreaseDeliveryQuantity,
        increaseCollectionQuantity,
        decreaseCollectionQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
