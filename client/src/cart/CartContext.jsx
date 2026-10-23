import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/client.js";

const CartContext = createContext(null);

const DEFAULT_INITIAL_CART = [
  {
    product: {
      id: "mart-1",
      name: "Kinley 20L Water Jar (Refill Exchange)",
      price: 90,
      image: "/products/water_jar.jpg",
      unit: "jar",
      store: "Al-Madina Store (Block D)",
    },
    quantity: 1,
  },
  {
    product: {
      id: "mart-2",
      name: "Farm Fresh Brown Eggs (Box of 12)",
      price: 140,
      image: "/products/brown_eggs.jpg",
      unit: "box",
      store: "Bashundhara Fresh Hub (Block G)",
    },
    quantity: 1,
  },
];

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("kl_cart");
      return saved ? JSON.parse(saved) : DEFAULT_INITIAL_CART;
    } catch {
      return DEFAULT_INITIAL_CART;
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [orderStep, setOrderStep] = useState(1);
  const [recentNotice, setRecentNotice] = useState("");

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("kl_cart", JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Sync with backend API cart if authenticated
  useEffect(() => {
    api("/api/shops/cart/current")
      .then(({ cart: dbCart }) => {
        if (dbCart && dbCart.items && dbCart.items.length > 0) {
          const mapped = dbCart.items.map((item) => ({
            product: {
              id: item.product.id,
              name: item.product.name,
              price: item.product.price,
              unit: item.product.unit || "unit",
              image:
                item.product.imageUrl ||
                (item.product.name.toLowerCase().includes("water")
                  ? "/products/water_jar.jpg"
                  : item.product.name.toLowerCase().includes("milk")
                  ? "/products/fresh_milk.jpg"
                  : item.product.name.toLowerCase().includes("egg")
                  ? "/products/brown_eggs.jpg"
                  : item.product.name.toLowerCase().includes("rice")
                  ? "/products/rice_bag.jpg"
                  : item.product.name.toLowerCase().includes("tissue")
                  ? "/products/tissue_box.svg"
                  : "/products/midnight_snacks.jpg"),
              store: dbCart.shop ? `${dbCart.shop.name} (Block ${dbCart.shop.block})` : "Bashundhara Merchant",
            },
            quantity: item.quantity,
          }));
          setCart(mapped);
        }
      })
      .catch(() => {});
  }, []);

  function addToCart(product, quantity = 1) {
    const itemImg =
      product.image ||
      product.imageUrl ||
      (product.name?.toLowerCase().includes("water")
        ? "/products/water_jar.jpg"
        : product.name?.toLowerCase().includes("milk")
        ? "/products/fresh_milk.jpg"
        : product.name?.toLowerCase().includes("egg")
        ? "/products/brown_eggs.jpg"
        : product.name?.toLowerCase().includes("rice")
        ? "/products/rice_bag.jpg"
        : product.name?.toLowerCase().includes("tissue")
        ? "/products/tissue_box.svg"
        : "/products/fresh_produce.jpg");

    const standardizedProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit || "unit",
      image: itemImg,
      store: product.store || "Bashundhara Merchant",
    };

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product: standardizedProduct, quantity }];
    });

    setRecentNotice(`${product.name} added to cart`);
    setTimeout(() => setRecentNotice(""), 3000);
  }

  function updateQuantity(productId, delta) {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const next = item.quantity + delta;
            return next > 0 ? { ...item, quantity: next } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  }

  function removeFromCart(productId) {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }

  function clearCart() {
    setCart([]);
  }

  function handleCheckout() {
    setCheckoutModalOpen(true);
    setOrderStep(1);
    const t1 = setTimeout(() => setOrderStep(2), 2000);
    const t2 = setTimeout(() => setOrderStep(3), 4500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }

  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const itemsSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = itemsSubtotal > 300 || itemsSubtotal === 0 ? 0 : 25;
  const grandTotal = itemsSubtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItemCount,
        itemsSubtotal,
        deliveryFee,
        grandTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        checkoutModalOpen,
        setCheckoutModalOpen,
        orderStep,
        handleCheckout,
        recentNotice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
