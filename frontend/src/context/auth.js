import { createContext, useContext, useEffect, useState } from "react";
import { createUser, getUserRole } from "../api/user";
import Api from "../api/axios";
import firebase from "./firebase";
import { USER, ADMIN, GUEST } from "../utils/roles";

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
  const [user, setUser] = useState(null);

  // När man loggar in, hämta i "then" också användaren från backend med roll
  // detsamma i useEffecten (men titta på om token kan sparas i localStorage ist)

  const login = (email, password) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async (response) => {
        return handleUser(response.user);
      })
      .catch((err) => console.log(err));
  };

  const reloadUser = async () => {
    // if register "stops" at login before redirecting to
    // add-shipment, add setUser(null) here before so the PageLoader starts ..
    let updatedUser = await firebase.auth().currentUser.reload();

    updatedUser = await firebase.auth().currentUser;

    handleUser(updatedUser);
  };

  const register = async (email, password, ...rest) => {
    try {
      const userCreds = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      await userCreds.user.sendEmailVerification();
    } catch (error) {
      //deleteUser();

      throw error;
    }

    /*
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async (response) => {
        try {
          await createUser(email, password, ...rest);

          return handleUser(response.user);
        } catch (error) {
          // If we saved the user to firebase but not backend(backend call fails),
          // then we delete the user altogether.
          // A bit "laggy" atm as the onAuthStateChanged is called before we get here...needs improv.
          deleteUser();

          throw error;
        }
      });*/
    //.catch((err) => handleUser(false));
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
      .catch(function (error) {
        // An error happened.
      });
  };

  const getUserToken = () => {
    return firebase.auth().currentUser.getIdToken(true);
  };

  const addUserRole = async (user) => {
    if (user) {
      const token = await getUserToken();

      const role = await getUserRole(token);

      return role.data;
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

  /* Below will add token header for ALL authorized headers
  const addApiToken = async () => {
    Api.interceptors.request.use(
      async (config) => {
        const token = await getUserToken();

        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  };*/

  const handleUser = async (rawUser) => {
    console.log("authstatechanged called...");
    if (rawUser && rawUser.emailVerified) {
      const user = await formatUser(rawUser);

      //await addApiToken();

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

export { AuthProvider, useAuth };
