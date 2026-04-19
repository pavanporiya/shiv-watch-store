export const getData = (key) => {
  return JSON.parse(localStorage.getItem(key)) || [];
};

export const setData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// AUTH
export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getWishlist = () => {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
};

export const setWishlist = (data) => {
  localStorage.setItem("wishlist", JSON.stringify(data));
};