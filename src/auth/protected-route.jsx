import { useEffect, useState } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { Navigate } from "react-router-dom";

export default function protected_route({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return user ? children : <Navigate to="/sign-in" />;
}
