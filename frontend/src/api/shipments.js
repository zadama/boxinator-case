import Api from "./axios";

const createShipment = (body, token) => {
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
  return Api.post("/receipt/", { ...body });
};

const updateShipment = (shipmentId, body, token) => {
  return Api.patch(
    "/shipment/" + shipmentId,
    { ...body },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const deleteShipment = (shipment_id, token) => {
  return Api.delete(`/shipment/${shipment_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export {
  createShipment,
  updateShipment,
  getAllShipments,
  deleteShipment,
  addShipmentReceipt,
};
