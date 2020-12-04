import Api from "./axios";

// Only for testing purposes...
const getAllAccounts = (token) => {
  return Api.get("/account/all", {
    headers: {
      Authorization: `${token}`,
    },
  });
};

const createUser = (email, password) => {
  return Api.post("/account/create", {
    email,
    password,
    firstName: "Aman",
    lastName: "Zadran",
    dateOfBirth: "2020-09-30",
    country: "Sweden",
    zipCode: 2341,
    contactNumber: 124123,
    role: "Admin",
  });
};

export { getAllAccounts, createUser };
