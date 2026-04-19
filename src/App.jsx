import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Product from "./pages/Product";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";

function AppWrapper() {
  const location = useLocation();

  return (
    <>
      <Navbar />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />

          <Route path="/auth" element={<Auth />} />

          <Route path="/cart" element={
            <ProtectedRoute><Cart /></ProtectedRoute>
          } />

          <Route path="/wishlist" element={
            <ProtectedRoute><Wishlist /></ProtectedRoute>
          } />

          <Route path="/checkout" element={
            <ProtectedRoute><Checkout /></ProtectedRoute>
          } />

          <Route path="/orders" element={
            <ProtectedRoute><Orders /></ProtectedRoute>
          } />

        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}