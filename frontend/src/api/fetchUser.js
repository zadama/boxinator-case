import Api from "./axios";

// Only for testing purposes...
const getAllAccounts = async () => {
  return await Api.get("/account/all");
};

export { getAllAccounts };
