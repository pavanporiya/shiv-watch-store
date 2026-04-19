import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";

export default function Auth() {
  const [mode, setMode] = useState("login"); // login | signup | forgot
  const [showPass, setShowPass] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  // STORAGE
  const getUsers = () => JSON.parse(localStorage.getItem("users")) || [];
  const setUsers = (users) =>
    localStorage.setItem("users", JSON.stringify(users));

  // ================= LOGIN =================
  const handleLogin = () => {
    const users = getUsers();

    // 🔥 EMPTY VALIDATION
    if (!email || !password) {
      setToast({ message: "Please fill all fields ⚠️", type: "error" });
      return;
    }

    const existingUser = users.find((u) => u.email === email);

    // 🔥 USER NOT FOUND
    if (!existingUser) {
      setToast({ message: "User does not exist ❌", type: "error" });
      return;
    }

    // 🔥 WRONG PASSWORD
    if (existingUser.password !== password) {
      setToast({ message: "Wrong password ❌", type: "error" });
      return;
    }

    // 🔥 SUCCESS
    localStorage.setItem("user", JSON.stringify(existingUser));
    window.dispatchEvent(new Event("userChanged"));

    setToast({ message: "Login successful ✅", type: "success" });

    setTimeout(() => {
      navigate("/");
    }, 800);
  };

  // ================= SIGNUP =================
  const handleSignup = () => {
    const users = getUsers();

    if (!email || !password) {
      setToast({ message: "Please fill all fields ⚠️", type: "error" });
      return;
    }

    if (users.find((u) => u.email === email)) {
      setToast({ message: "User already exists ❌", type: "error" });
      return;
    }

    users.push({ email, password });
    setUsers(users);

    setToast({ message: "Account created ✅", type: "success" });

    setTimeout(() => {
      setMode("login");
    }, 800);
  };

  // ================= RESET =================
  const handleReset = () => {
    const users = getUsers();
    const index = users.findIndex((u) => u.email === email);

    if (!email || !password) {
      setToast({ message: "Please fill all fields ⚠️", type: "error" });
      return;
    }

    if (index === -1) {
      setToast({ message: "Email not found ❌", type: "error" });
      return;
    }

    users[index].password = password;
    setUsers(users);

    setToast({ message: "Password updated ✅", type: "success" });

    setTimeout(() => {
      setMode("login");
    }, 800);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        {/* TOGGLE */}
        {mode !== "forgot" && (
          <div className="auth-toggle">
            <span
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
            >
              Login
            </span>
            <span
              className={mode === "signup" ? "active" : ""}
              onClick={() => setMode("signup")}
            >
              Signup
            </span>
          </div>
        )}

        <h2>
          {mode === "login" && "Welcome Back"}
          {mode === "signup" && "Create Account"}
          {mode === "forgot" && "Reset Password"}
        </h2>

        <div className="auth-grid">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="password-field">
            <input
              type={showPass ? "text" : "password"}
              placeholder={mode === "forgot" ? "New Password" : "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span onClick={() => setShowPass(!showPass)}>
              {showPass ? "🙈" : "👁️"}
            </span>
          </div>

          {/* BUTTONS */}
          {mode === "login" && (
            <button className="auth-btn" onClick={handleLogin}>
              Login
            </button>
          )}

          {mode === "signup" && (
            <button className="auth-btn" onClick={handleSignup}>
              Create Account
            </button>
          )}

          {mode === "forgot" && (
            <button className="auth-btn" onClick={handleReset}>
              Reset Password
            </button>
          )}
        </div>

        {/* LINKS */}
        {mode === "login" && (
          <p className="forgot" onClick={() => setMode("forgot")}>
            Forgot Password?
          </p>
        )}

        {mode === "forgot" && (
          <p className="forgot" onClick={() => setMode("login")}>
            Back to Login
          </p>
        )}
      </div>

      {/* TOAST */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}