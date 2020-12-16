import { USER } from "../utils/roles";
import Api from "./axios";

// Only for testing purposes...
const getAllAccounts = (token) => {
  return Api.get("/account/all", {
    headers: {
      Authorization: `${token}`,
    },
  });
};

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

export { getAllAccounts, createUser, checkToken, getUserRole };
