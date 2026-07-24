import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import { setUser } from "../utils/storage";

export default function Auth() {
  const [mode, setMode] = useState("login"); // login | signup | forgot
  const [showPass, setShowPass] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  // STORAGE
  const getUsers = () => {
    try {
      return JSON.parse(localStorage.getItem("users")) || [];
    } catch {
      return [];
    }
  };

  const setUsers = (users) => {
    localStorage.setItem("users", JSON.stringify(users));
  };

  const validateForm = () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setToast({ message: "Please fill in all fields ⚠️", type: "error" });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setToast({ message: "Please enter a valid email address ⚠️", type: "error" });
      return false;
    }

    if (trimmedPassword.length < 6) {
      setToast({ message: "Password must be at least 6 characters ⚠️", type: "error" });
      return false;
    }

    return true;
  };

  // ================= LOGIN =================
  const handleLogin = (e) => {
    if (e) e.preventDefault();
    if (isLoading) return;

    if (!validateForm()) return;

    setIsLoading(true);

    setTimeout(() => {
      const users = getUsers();
      const trimmedEmail = email.trim();
      const existingUser = users.find((u) => u.email.toLowerCase() === trimmedEmail.toLowerCase());

      if (!existingUser) {
        setIsLoading(false);
        setToast({ message: "User does not exist. Please sign up ❌", type: "error" });
        return;
      }

      if (existingUser.password !== password.trim()) {
        setIsLoading(false);
        setToast({ message: "Invalid email or password ❌", type: "error" });
        return;
      }

      setUser(existingUser);
      window.dispatchEvent(new Event("userChanged"));

      setToast({ message: "Login successful ✅", type: "success" });

      setTimeout(() => {
        setIsLoading(false);
        navigate("/");
      }, 600);
    }, 400);
  };

  // ================= SIGNUP =================
  const handleSignup = (e) => {
    if (e) e.preventDefault();
    if (isLoading) return;

    if (!validateForm()) return;

    setIsLoading(true);

    setTimeout(() => {
      const users = getUsers();
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      if (users.find((u) => u.email.toLowerCase() === trimmedEmail.toLowerCase())) {
        setIsLoading(false);
        setToast({ message: "User with this email already exists ❌", type: "error" });
        return;
      }

      const newUser = { email: trimmedEmail, password: trimmedPassword };
      users.push(newUser);
      setUsers(users);

      setToast({ message: "Account created successfully 🎉", type: "success" });

      setTimeout(() => {
        setIsLoading(false);
        setMode("login");
      }, 600);
    }, 400);
  };

  // ================= RESET =================
  const handleReset = (e) => {
    if (e) e.preventDefault();
    if (isLoading) return;

    if (!validateForm()) return;

    setIsLoading(true);

    setTimeout(() => {
      const users = getUsers();
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      const index = users.findIndex((u) => u.email.toLowerCase() === trimmedEmail.toLowerCase());

      if (index === -1) {
        setIsLoading(false);
        setToast({ message: "Email not found ❌", type: "error" });
        return;
      }

      users[index].password = trimmedPassword;
      setUsers(users);

      setToast({ message: "Password updated successfully ✅", type: "success" });

      setTimeout(() => {
        setIsLoading(false);
        setMode("login");
      }, 600);
    }, 400);
  };

  return (
    <main id="main-content" className="auth-container">
      <div className="auth-box">
        {/* TOGGLE */}
        {mode !== "forgot" && (
          <div className="auth-toggle" role="tablist" aria-label="Authentication mode">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              className={mode === "login" ? "active" : ""}
              onClick={() => {
                if (!isLoading) setMode("login");
              }}
              style={{ background: "none", border: "none", font: "inherit", cursor: "pointer" }}
            >
              Login
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signup"}
              className={mode === "signup" ? "active" : ""}
              onClick={() => {
                if (!isLoading) setMode("signup");
              }}
              style={{ background: "none", border: "none", font: "inherit", cursor: "pointer" }}
            >
              Signup
            </button>
          </div>
        )}

        <h1>
          {mode === "login" && "Welcome Back"}
          {mode === "signup" && "Create Account"}
          {mode === "forgot" && "Reset Password"}
        </h1>

        <form
          className="auth-grid"
          onSubmit={(e) => {
            if (mode === "login") handleLogin(e);
            else if (mode === "signup") handleSignup(e);
            else handleReset(e);
          }}
        >
          <div>
            <label htmlFor="auth-email" className="sr-only">Email address</label>
            <input
              id="auth-email"
              type="email"
              placeholder="Email"
              aria-label="Email address"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              style={{ width: "100%" }}
            />
          </div>

          <div className="password-field">
            <label htmlFor="auth-password" className="sr-only">
              {mode === "forgot" ? "New Password" : "Password"}
            </label>
            <input
              id="auth-password"
              type={showPass ? "text" : "password"}
              placeholder={mode === "forgot" ? "New Password" : "Password"}
              aria-label={mode === "forgot" ? "New Password" : "Password"}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />

            <button
              type="button"
              className="pass-toggle-btn"
              aria-label={showPass ? "Hide password" : "Show password"}
              onClick={() => setShowPass(!showPass)}
              disabled={isLoading}
              style={{
                background: "none",
                border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
                padding: 0,
                color: "inherit"
              }}
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>

          {/* BUTTONS */}
          {mode === "login" && (
            <button
              type="submit"
              className="auth-btn"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          )}

          {mode === "signup" && (
            <button
              type="submit"
              className="auth-btn"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          )}

          {mode === "forgot" && (
            <button
              type="submit"
              className="auth-btn"
              disabled={isLoading}
            >
              {isLoading ? "Updating Password..." : "Reset Password"}
            </button>
          )}
        </form>

        {/* LINKS */}
        {mode === "login" && (
          <button
            type="button"
            className="forgot"
            onClick={() => {
              if (!isLoading) setMode("forgot");
            }}
            style={{ background: "none", border: "none", font: "inherit", cursor: "pointer" }}
          >
            Forgot Password?
          </button>
        )}

        {mode === "forgot" && (
          <button
            type="button"
            className="forgot"
            onClick={() => {
              if (!isLoading) setMode("login");
            }}
            style={{ background: "none", border: "none", font: "inherit", cursor: "pointer" }}
          >
            Back to Login
          </button>
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
    </main>
  );
}