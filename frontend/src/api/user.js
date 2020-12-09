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

//{...body} instead

const createUser = (
  email,
  password,
  firstName,
  lastName,
  dateOfBirth,
  country,
  zipCode,
  contactNumber
) => {
  return Api.post("/account/register", {
    email,
    password,
    firstName,
    lastName,
    dateOfBirth,
    country,
    zipCode,
    contactNumber,
    role: USER,
  });
};

export { getAllAccounts, createUser, checkToken, getUserRole };
