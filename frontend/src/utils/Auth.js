export function registerUser(name, email, password) {
  const existingUser = localStorage.getItem("user");

  if (existingUser) {
    const user = JSON.parse(existingUser);
    if (user.email === email) {
      return { success: false, message: "An account with this email already exists." };
    }
  }

  const newUser = { name, email, password };
  localStorage.setItem("user", JSON.stringify(newUser));

  return { success: true, message: "Account created successfully!" };
}

// Check login credentials against the saved user (called from Login page)
export function loginUser(email, password) {
  const savedUser = localStorage.getItem("user");

  if (!savedUser) {
    return { success: false, message: "No account found. Please register first." };
  }

  const user = JSON.parse(savedUser);

  if (user.email === email && user.password === password) {
    localStorage.setItem("isLoggedIn", "true");
    return { success: true, message: "Login successful!" };
  }

  return { success: false, message: "Incorrect email or password." };
}