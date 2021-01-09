import { createContext, useContext, useEffect, useState } from "react";
import { createUser, getUserRole, createAnonUser } from "../api/user";
import Api from "../api/axios";
import firebase from "./firebase";
import { USER, ADMIN, GUEST } from "../utils/roles";

const authContext = createContext();

const AuthProvider = ({ children }) => {
  const auth = useProvideAuthImpl();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

const useProvideAuthImpl = () => {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async (response) => {
        return handleUser(response.user);
      })
      .catch((err) => {});
  };

  const loginAnonymously = async (email) => {
    try {
      const response = await createAnonUser(email);
      const { data } = response.data;
      const user = { email: data.email, role: data.role };
      setUser(user);
    } catch (error) {
      setUser(false);
      throw error;
    }
  };

  const reloadUser = async () => {
    let updatedUser = await firebase.auth().currentUser.reload();

    updatedUser = await firebase.auth().currentUser;

    await handleUser(updatedUser);
  };

  const register = async (email, password, ...rest) => {
    try {
      const userCreds = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      await userCreds.user.sendEmailVerification();
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => handleUser(false));
  };

  const deleteUser = () => {
    return firebase
      .auth()
      .currentUser.delete()
      .then(function () {
        return handleUser(false);
      })
      .catch(function (error) {});
  };

  const getUserToken = () => {
    return firebase.auth().currentUser.getIdToken(true);
  };

  const handleUser = async (rawUser) => {
    if (rawUser && rawUser.emailVerified) {
      const user = await formatUser(rawUser);

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

  return {
    user,
    login,
    loginAnonymously,
    logout,
    deleteUser,
    register,
    getUserToken,
    reloadUser,
  };
};

const useAuth = () => {
  return useContext(authContext);
};

const addUserRole = async (user) => {
  if (user) {
    const token = await firebase.auth().currentUser.getIdToken(true);

    const response = await getUserRole(token);
    const { data: role } = response.data;

    return role;
  }
};

const formatUser = async (user) => {
  const role = await addUserRole(user);

  return {
    userId: user.uid,
    email: user.email,
    role: role,
  };
};

export { AuthProvider, useAuth };
