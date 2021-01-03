import React from "react";
import DeleteShipmentModal from "./DeleteShipmentModal";
import EditShipmentModal from "./EditShipmentModal";

const ShipmentList = ({shipmentList=[], updateShipment, deleteShipment}) => {

    const shipmentObjects = shipmentList.map((shipment, index) => {
        return (
            <tr key={shipment.id}>
                <td>{shipment.id}</td>
                <td>{shipment.account}</td>
                <td>{shipment.receiver}</td>
                <td>{shipment.weight}</td>
                <td>{shipment.boxColour}</td>
                <td>{shipment.shipmentStatus}</td>
                <td>{shipment.destinationCountry}</td>
                <td>{shipment.sourceCountry}</td>
                <td>
                    <div className="row">
                        <EditShipmentModal shipment={shipment} updateShipment={updateShipment}/>
                        <DeleteShipmentModal shipment={shipment} deleteShipment={deleteShipment}/>
                    </div>
                </td>
            </tr>
        )
    });

    return (
            <table className="table table-bordered">
                <thead className="thead-light">
                <tr>
                    <th scope="col">Shipment Id</th>
                    <th scope="col"> Account</th>
                    <th scope="col">Receiver</th>
                    <th scope="col">Weight</th>
                    <th scope="col">Box Colour</th>
                    <th scope="col">Shipment Status</th>
                    <th scope="col">Destination Country</th>
                    <th scope="col">Source Country</th>
                    <th scope="col">Edit Details</th>
                </tr>
                </thead>
                <tbody>
                { shipmentList.length > 0
                    ? shipmentObjects
                        :<tr>
                            <td>No record was found.</td>
                        </tr>
                }
                </tbody>
            </table>
    );
};

export default ShipmentList;