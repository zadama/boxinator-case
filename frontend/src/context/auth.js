import { createContext, useContext, useEffect, useState } from "react";

const authContext = createContext();

const AuthProvider = ({ children }) => {
  // Consider using, useReducer instead.
  const auth = useProvideAuthImpl();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

let initialUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const useProvideAuthImpl = () => {
  const [user, setUser] = useState(initialUser);

  const login = (username, password) => {};

  const register = (username, password) => {};

  const logout = () => {};

  useEffect(() => {
    console.log("IN PROVIDER");

    setTimeout(() => {
      setUser({ username: "Aman", role: "USER" });
    }, 3000);

    // make API call to verify user.
    /*
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();*/
  }, []);

  return { user, login, register, logout };
};

const useAuth = () => {
  return useContext(authContext);
};

export { AuthProvider, useAuth };
