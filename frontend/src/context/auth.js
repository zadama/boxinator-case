import { createContext, useContext, useEffect, useState } from "react";
import firebase from "./firebase";

const authContext = createContext();

const AuthProvider = ({ children }) => {
  // Consider using, useReducer instead.
  const auth = useProvideAuthImpl();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

// Remove if firebase is used..
let initialUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const useProvideAuthImpl = () => {
  const [user, setUser] = useState(initialUser);

  const login = (email, password) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => handleUser(response.user));
    // .catch((err) => handleUser(false));
  };

  const register = (email, password) => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => handleUser(response.user));
    //.catch((err) => handleUser(false));
  };

  const logout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => handleUser(false));
  };

  const getUserToken = () => {
    return firebase.auth().currentUser.getIdToken();
  };

  const handleUser = (rawUser) => {
    if (rawUser) {
      console.log(rawUser);
      // Get user object in format expected by front-end
      const user = formatUser(rawUser);
      // below shall change dynamically.
      user.role = "ADMIN";

      // Add or update user in database/backend
      // createUser(user.uid, { email: user.email });

      setUser(user);
      return user;
    } else {
      setUser(false);
      return false;
    }
  };

  useEffect(() => {
    // Subscribe to user on mount
    const unsubscribe = firebase.auth().onAuthStateChanged(handleUser);

    // Unsubscribe on cleanup
    return () => unsubscribe();
  }, []);

  return { user, login, register, logout, getUserToken };
};

// Format user object
// If there are extra fields you want from the original user
// object then you'd add those here.
const formatUser = (user) => {
  return {
    userId: user.uid,
    email: user.email,
  };
};

const useAuth = () => {
  return useContext(authContext);
};

export { AuthProvider, useAuth };
