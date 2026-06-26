import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { account } from "./appwrite/config";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAndClearSession() {
      try {
        await account.deleteSession("current");
      } catch {
        // no active session, that's fine
      }
      setLoggedIn(false);
      setLoading(false);
    }
    checkAndClearSession();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Routes>
      <Route
        path="/"
        element={loggedIn ? <HomePage /> : <Navigate to="/login" />}
      />
      <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;