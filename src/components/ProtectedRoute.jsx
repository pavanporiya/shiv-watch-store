import { Navigate } from "react-router-dom";
import { getUser } from "../utils/storage";

export default function ProtectedRoute({ children }) {
  const user = getUser();

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return children;
}