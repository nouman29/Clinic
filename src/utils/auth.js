import seed from "../data/db.json";

const AUTH_KEY = "clinic_isAuth";

export const isAuthenticated = () => localStorage.getItem(AUTH_KEY) === "true";

export const login = ({ email, password }) => {
  const validEmail = seed.doctor.email;
  const validPassword = seed.doctor.password;

  if (email === validEmail && password === validPassword) {
    localStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

