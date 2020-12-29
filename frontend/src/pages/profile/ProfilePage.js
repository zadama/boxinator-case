import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast'
import PrivateLayout from '../../layouts/PrivateLayout';
import { useAuth } from "../../context/auth";
import { getAccount } from '../../api/user';

import './style.scss';

import EditAccountModal from '../admin/AccountPageModals/EditAccountModal';

const ProfilePage = () => {

    const auth = useAuth();
    const [data, setData] = useState(null);
    
    const [editAccountView, setEditAccountView] = useState(false);
    const [thisAccount, setThisAccount] = useState(null);

    const [toast, setToast] = useState(false);
    const [toastMsg, setToastMsg] = useState("");

    const renderProfilePageWithData = async () => {
        try {
            const token = await auth.getUserToken();

            const { data: thisAccount } = await getAccount(token, auth.user.email);
    
            setData(thisAccount.data);
            console.log(thisAccount.data);
        } catch (error) {
            console.log(error);
        }
        

    }

    useEffect(() => {
        renderProfilePageWithData();
    }, []);

    const handleEditClick = (account) => { // Open modal when admin wants to edit an account
        setEditAccountView(!editAccountView);
        setThisAccount(account);
    }

    const toggleToast = (action) => {
        setToastMsg(action);
        setToast(true);
    }

    const handleCancelShipmentClick = (shipment) => {
        try {

            console.log(shipment);

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <PrivateLayout>
            <>
            <Toast show={toast} onClose={() => {
                setToast(false) 
                setToastMsg("")
            }} delay={2500} autohide>
                <Toast.Header>
                    <strong className="mr-auto">Bootstrap</strong>
                    <small>just now</small>
                </Toast.Header>
                <Toast.Body>Account {toastMsg && toastMsg}.</Toast.Body>
            </Toast>
            {!data ? 
                <h3>loading...</h3> :
                (<>
                <h3>Welcome "{data.firstName}"</h3>
                <div className="profile-page">
                    <div>
                        <label htmlFor="id">Account ID: </label>
                        <span>{data.id}</span>
                    </div>
                    <div>
                        <label htmlFor="firstName">Firstname: </label>
                        <span>{data.firstName}</span>
                    </div>
                    <div>
                        <label htmlFor="lastName">Lastname: </label>
                        <span>{data.lastName}</span>
                    </div>
                    <div>
                        <label htmlFor="email">Email: </label>
                        <span>{data.email}</span>
                    </div>
                    <div>
                        <label htmlFor="dateOfBirth">Date of birth: </label>
                        <span>{data.dateOfBirth}</span>
                    </div>
                    <div>
                        <label htmlFor="country">Country: </label>
                        <span>{data.country}</span>
                    </div>
                    <div>
                        <label htmlFor="contactNumber">Contact number: </label>
                        <span>{data.contactNumber}</span>
                    </div>
                    <div>
                        <label htmlFor="zipCode">Zip code: </label>
                        <span>{data.zipCode}</span>
                    </div>
                    
                </div>

                <Button onClick={() => handleEditClick(data)}>edit</Button>
                <Button onClick={async () => {
                    await auth.logout();
                    //history.replace("/login");
                }}>logout</Button>

                <section>
                    <h3>{data.firstName}'s shipments</h3>
                    <Table>
                        <thead>
                            <tr>
                                <th>Shipment ID</th>
                                <th>Receiver</th>
                                <th>Status</th>
                                <th>Source country</th>
                                <th>Destination country</th>
                                <th>Price</th>
                                <th>Weight</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!data.shipments ? "No shipments." : data.shipments.map((shipment) => {
                                return (<tr key={shipment.id}>
                                    <td>{shipment.id}</td>
                                    <td>{shipment.receiver}</td>
                                    <td>{shipment.shipmentStatus}</td>
                                    <td>{shipment.sourceCountry}</td>
                                    <td>{shipment.destinationCountry.name}</td>
                                    <td>{shipment.totalPrice}</td>
                                    <td>{shipment.weight}</td>
                                    <td><Button variant="danger" onClick={() => handleCancelShipmentClick(shipment)}>X</Button></td>
                                </tr>)
                            })}
                        </tbody>
                    </Table>
                </section>
            </>)}
            {editAccountView && <EditAccountModal onClose={() => setEditAccountView(!editAccountView)} thisAccount={thisAccount} toggleToast={toggleToast} reRender={renderProfilePageWithData}/>}
            </>
        </PrivateLayout>
    )
}

export default ProfilePage;