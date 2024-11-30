import { useState } from "react";
import { createGlobalStore } from "hox";

export const [useAcountStore, getAcountStore] = createGlobalStore(() => {
  const initialUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [user, setUser] = useState(initialUser);

  const login = (user, token) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  const update = (user) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setUser({});
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return { login, logout, update, user };
});

export const [useLoadingStore, getLoadingStore] = createGlobalStore(() => {
  const [loading, setLoading] = useState(false);

  return { loading, setLoading };
});
