import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { isLoggedIn } from "./utils/auth";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={isLoggedIn() ? <HomePage /> : <Navigate to="/login" />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;