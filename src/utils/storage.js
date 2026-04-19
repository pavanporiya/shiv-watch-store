export const getData = (key) => {
  return JSON.parse(localStorage.getItem(key)) || [];
};

export const setData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// ================= AUTH =================
export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem("user");
};

// 🔥 ALWAYS SAFE KEY (NO NULL / NO GLOBAL FALLBACK)
const getUserKey = (base) => {
  const user = getUser();

  // ✅ guest support (IMPORTANT)
  if (!user) return `${base}_guest`;

  return `${base}_${user.email}`;
};

// ================= CART =================
export const getCart = () => {
  return getData(getUserKey("cart"));
};

export const setCart = (data) => {
  setData(getUserKey("cart"), data);
};

// ================= WISHLIST =================
export const getWishlist = () => {
  return getData(getUserKey("wishlist"));
};

export const setWishlist = (data) => {
  setData(getUserKey("wishlist"), data);
};

// ================= ORDERS =================
export const getOrders = () => {
  return getData(getUserKey("orders"));
};

export const setOrders = (data) => {
  setData(getUserKey("orders"), data);
};