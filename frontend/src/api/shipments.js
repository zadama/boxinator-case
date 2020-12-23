import Api from "./axios";

const createShipment = (body, token) => {
  console.log({ ...body });

  return Api.post(
    "/shipment/create",
    { ...body },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const getAllShipments = (token) => {
  return Api.get("/shipment/all", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const addShipmentReceipt = (body) => {
  console.log(body);
  return Api.post("/receipt/", { ...body });
};

export { createShipment, getAllShipments, addShipmentReceipt };
