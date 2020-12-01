package com.example.boxinator.Controllers;



public class ShipmentController {

    /*
    * GET/ (get all relevant to user, admin sees all, non-cancelled, non-complete, can be filtered using status or date)
    * GET/complete
    * GET/cancelled
    * POST/ (create new shipment)
    * GET/:shipment_id (get details about specific shipment),
    * GET/complete/:shipment_id (get details about specific completed shipment),
    * GET/:customer_id (get all shipments by a customer)
    * GET/complete/:customer_id (get all complete shipments by a customer)
    * GET/:customer_id/:shipment_id (get a specific shipment by a customer)
    * POST/:shipment_id (used to update a shipment, user can only cancel, admin can change status
    * DELETE/:shipment_id Only accessible by admin, only in extreme situations, can delete complete/cancelled shipments
    *
    * */

}
