import Api from "./axios";

const getAllShipments = (token) =>{
    return Api.get("/shipment/all", {headers: { Authorization: `Bearer ${token}` },
});
}

export {getAllShipments}