export const getData = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return [];
    const parsed = JSON.parse(item);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

export const setData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save to localStorage:", e);
  }
};

// ================= AUTH =================
export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    return null;
  }
};

export const setUser = (user) => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }
};

export const logout = () => {
  localStorage.removeItem("user");
};

// 🔥 ALWAYS SAFE KEY (NO NULL / NO GLOBAL FALLBACK)
export const getUserKey = (base) => {
  const user = getUser();

  // ✅ guest support (IMPORTANT)
  if (!user) return `${base}_guest`;

  return `${base}_${user.email}`;
};

// ================= CART =================
export const getCart = () => {
  const rawCart = getData(getUserKey("cart"));
  // Standardize quantity field to qty across legacy & new records
  return rawCart.map((item) => ({
    ...item,
    qty: item.qty || item.quantity || 1,
    quantity: item.qty || item.quantity || 1,
  }));
};

export const setCart = (data) => {
  setData(getUserKey("cart"), data);
};

export const addToCartHelper = (product, quantity = 1) => {
  const user = getUser();
  if (!user) {
    return { success: false, reason: "LOGIN_REQUIRED", message: "Please log in to add items to cart" };
  }

  const cart = getCart();
  const existingIndex = cart.findIndex((item) => item.id === product.id);

  if (existingIndex !== -1) {
    cart[existingIndex].qty += quantity;
    cart[existingIndex].quantity = cart[existingIndex].qty;
  } else {
    const qtyVal = quantity > 0 ? quantity : 1;
    cart.push({
      ...product,
      qty: qtyVal,
      quantity: qtyVal,
    });
  }

  setCart(cart);
  return { success: true, cart, message: "Added to cart" };
};

export const removeFromCartHelper = (productId) => {
  const cart = getCart().filter((item) => item.id !== productId);
  setCart(cart);
  return cart;
};

export const updateCartQtyHelper = (productId, newQty) => {
  let cart = getCart();
  if (newQty <= 0) {
    cart = cart.filter((item) => item.id !== productId);
  } else {
    cart = cart.map((item) => {
      if (item.id === productId) {
        return { ...item, qty: newQty, quantity: newQty };
      }
      return item;
    });
  }
  setCart(cart);
  return cart;
};

export const clearCartHelper = () => {
  setCart([]);
};

// ================= WISHLIST =================
export const getWishlist = () => {
  return getData(getUserKey("wishlist"));
};

export const setWishlist = (data) => {
  setData(getUserKey("wishlist"), data);
};

export const addToWishlistHelper = (product) => {
  const wishlist = getWishlist();
  const exists = wishlist.some((item) => item.id === product.id);

  if (exists) {
    return { success: false, reason: "EXISTS", message: "Already in Wishlist" };
  }

  wishlist.push(product);
  setWishlist(wishlist);
  return { success: true, wishlist, message: "Added to Wishlist" };
};

export const removeFromWishlistHelper = (productId) => {
  const updated = getWishlist().filter((item) => item.id !== productId);
  setWishlist(updated);
  return updated;
};

// ================= ORDERS =================
export const getOrders = () => {
  return getData(getUserKey("orders"));
};

export const setOrders = (data) => {
  setData(getUserKey("orders"), data);
};

export const createOrderHelper = (orderInfo) => {
  const cart = getCart();
  if (cart.length === 0) {
    return { success: false, message: "Cart is empty" };
  }

  const total = cart.reduce((acc, item) => acc + item.price * (item.qty || item.quantity || 1), 0);

  const newOrder = {
    id: Date.now(),
    items: cart,
    user: orderInfo || null,
    total: total,
    date: new Date().toLocaleString(),
    status: "Order Received",
  };

  const orders = getOrders();
  orders.unshift(newOrder);
  setOrders(orders);

  clearCartHelper();
  window.dispatchEvent(new Event("ordersUpdated"));

  return { success: true, order: newOrder, message: "Order placed successfully" };
};