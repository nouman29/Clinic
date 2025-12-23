import Cookies from "js-cookie";

const AUTH_KEY = "clinic_isAuth";

export const isAuthenticated = () => {
  // Check if token exists in cookies
  const token = Cookies.get("token");
  // Also check local storage for backward compatibility or as an additional flag
  const isAuth = localStorage.getItem(AUTH_KEY) === "true";
  return !!token || isAuth;
};

export const login = async ({ email, password }) => {
  try {
    const response = await fetch("http://localhost:5001/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem(AUTH_KEY, "true");
      return { success: true, user: data.user };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
};

export const logout = async () => {
  try {
    await fetch("http://localhost:5001/api/auth/logout", {
      method: "GET",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem(AUTH_KEY);
    Cookies.remove("token");
  }
};

