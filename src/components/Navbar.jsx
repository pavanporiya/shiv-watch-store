import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUser, logout } from "../utils/storage";

export default function Navbar() {
  const [user, setUser] = useState(getUser());
  const navigate = useNavigate();

  // 🔥 FIX: Listen for login/logout changes
  useEffect(() => {
    const updateUser = () => {
      setUser(getUser());
    };

    window.addEventListener("userChanged", updateUser);

    return () => {
      window.removeEventListener("userChanged", updateUser);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    window.dispatchEvent(new Event("userChanged"));
    navigate("/");
  };

  return (
    <nav className="nav-container">
      <Link to="/" className="logo">
        Shiv Watch
      </Link>

      <div className="nav-items">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/shop" className="nav-link">Shop</Link>

        {user && (
          <>
            <Link to="/cart" className="nav-link">Cart</Link>
            
            <Link to="/orders" className="nav-link">Orders</Link>
          </>
        )}

        {!user ? (
          <Link to="/auth" className="nav-link">Login</Link>
        ) : (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}