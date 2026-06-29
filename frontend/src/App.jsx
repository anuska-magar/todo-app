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
        // Check if we have a flag that says "this is a fresh start"
        const isFreshStart = sessionStorage.getItem('app_initialized');
        
        if (!isFreshStart) {
          // This is a fresh start (re-run), clear session
          try {
            await account.deleteSession("current");
            console.log("Session cleared on fresh start");
          } catch {
            console.log("No session to clear");
          }
          // Set the flag so it won't clear on refresh
          sessionStorage.setItem('app_initialized', 'true');
          setLoggedIn(false);
        } else {
          // This is a refresh, check if session exists
          try {
            const session = await account.getSession("current");
            if (session) {
              setLoggedIn(true);
            } else {
              setLoggedIn(false);
            }
          } catch {
            setLoggedIn(false);
          }
        }
      } catch (error) {
        console.error("Session check error:", error);
        setLoggedIn(false);
      } finally {
        setLoading(false);
      }
    }
    checkAndClearSession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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