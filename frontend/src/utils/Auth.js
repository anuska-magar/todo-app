// utils/auth.js - Simple localStorage version

export function registerUser(name, email, password) {
  // Check if user already exists in localStorage
  const existingUser = localStorage.getItem("user");

  if (existingUser) {
    const user = JSON.parse(existingUser);
    if (user.email === email) {
      return { success: false, message: "An account with this email already exists." };
    }
  }

  // Create new user
  const newUser = { 
    name, 
    email, 
    password,
    joinedDate: new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    })
  };
  
  localStorage.setItem("user", JSON.stringify(newUser));
  
  // Don't auto-login - user should go to login page
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("currentUser");

  return { success: true, message: "Account created successfully!" };
}

export function loginUser(email, password) {
  const savedUser = localStorage.getItem("user");

  if (!savedUser) {
    return { success: false, message: "No account found. Please register first." };
  }

  const user = JSON.parse(savedUser);

  if (user.email === email && user.password === password) {
    localStorage.setItem("isLoggedIn", "true");
    // Store user data for display
    localStorage.setItem("currentUser", JSON.stringify({
      name: user.name,
      email: user.email,
      joinedDate: user.joinedDate || new Date().toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      })
    }));
    return { success: true, message: "Login successful!" };
  }

  return { success: false, message: "Incorrect email or password." };
}

export function isLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}

export function logoutUser() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("currentUser");
  return { success: true };
}