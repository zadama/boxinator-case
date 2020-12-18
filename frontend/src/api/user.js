import { USER, ADMIN } from "../utils/roles";
import Api from "./axios";

// Only for testing purposes...
const getAllAccounts = (token) => {
  return Api.get("/account/all", {
    headers: {
      Authorization: `${token}`,
    },
  });
};

const getAccount = (token, account_id) => {
  return Api.get("/account/"+account_id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const deleteAccount = (token, account_id) => {
  return Api.delete("/account/"+account_id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const updateAccount = (token, account_id, newUser) => {
  return Api.patch("/account/"+account_id, { ...newUser }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


const checkToken = (token) => {
  return Api.get("/accounttest/checktoken", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Only for testing purposes...
const getUserRole = (token) => {
  return Api.get("/accounttest/role", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//{...body, role:USER} instead

const createUser = (body) => {
  return Api.post("/account/register", {
    ...body,
    role: USER,
  });
};

export { getAllAccounts, getAccount, updateAccount, deleteAccount, createUser, checkToken, getUserRole };
