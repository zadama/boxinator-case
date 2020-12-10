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

export { createShipment };
