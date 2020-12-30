import { USER, ADMIN, GUEST } from "../utils/roles";
import Api from "./axios";

// Only for testing purposes...
const getAllAccounts = (token) => {
  return Api.get("/account/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
/*
const getAccount = (token, account_id) => {
  return Api.get("/account/" + account_id, {
*/
const getAccount = (token, account_email) => {
  return Api.get("/account/" + account_email, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const deleteAccount = (token, account_id) => {
  return Api.delete("/account/" + account_id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const updateAccount = (token, account_id, newUser) => {
  return Api.patch(
    "/account/" + account_id,
    { ...newUser },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const checkToken = (token) => {
  return Api.get("/accounttest/checktoken", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Only for testing purposes...
const getUserRole = (token) => {
  return Api.get("/account/role", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const createAnonUser = (email) => {
  return Api.post("/receipt/account", {
    email: email,
    role: GUEST,
  });
};

//{...body, role:USER} instead

const updateUser = (body, id, token) => {
  return Api.patch(
    "/account/" + id,
    {
      ...body,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

const createUser = (body) => {
  return Api.post("/account/register", {
    ...body,
    role: USER,
  });
};

export {
  getAllAccounts,
  getAccount,
  updateAccount,
  deleteAccount,
  createUser,
  createAnonUser,
  checkToken,
  getUserRole,
  updateUser,
};
