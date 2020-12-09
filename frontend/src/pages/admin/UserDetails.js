import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { getAllAccounts } from '../../api/user';

import "./style.scss";

import { useAuth } from "../../context/auth";


const UserDetails = () => {
    const auth = useAuth();
    const [data, setData] = useState(null);
    const [editUserView, setEditUserView] = useState(false);
    const [thisUser, setThisUser] = useState(null);
    const [editedUser, setEditedUser] = useState([]);

    const renderUserDataWithAdminToken = async () => {
        try {
            const token = await auth.getUserToken();

            const { data } = await getAllAccounts(token);

            setData(data);
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        renderUserDataWithAdminToken();
    }, [])

    const handleEditClick = (user) => {
        setEditUserView(!editUserView);
        setThisUser(user);
    }

    const handleDeleteClick = (user) => {
        alert("Are you sure you want to delete the account with id: "+ user.id);
    }

    const handleEditUserView = () => {
        setEditUserView(!editUserView);
    }

    const updateField = (input, id) => {
        setEditedUser({
            "id": input // create field of the input user just changed
        })
    }

    const handleSaveEditedUser = () => {
        console.log(editedUser);
        setEditUserView(!editUserView);
    }

    return (
        <>
        {!data ? (
            <div>loading...</div>
        ) : (
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Date of Birth</th>
                        <th>Zipcode</th>
                        <th>Country of residence</th>
                        <th>Contact number</th>
                        <th>Role</th>
                        <th>Shipments</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {data.data.map(function(user){
                            return <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.firstName} {user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{!user.dateOfBirth ? "Not defined" : user.dateOfBirth}</td>
                                <td>{!user.zipCode ? "Not defined" : user.zipCode}</td>
                                <td>{!user.country ? "Not defined" : user.country}</td>
                                <td>{!user.contactNumber ? "Not defined" : user.contactNumber}</td>
                                <td>{user.role}</td>
                                <td className="shipments">{user.shipments}</td>
                                <td className="btns">
                                    <button className="btns" onClick={() => handleEditClick(user)}>Edit </button>
                                    <button className="btns" onClick={() => handleDeleteClick(user)}> Delete</button>
                                </td>
                            </tr>
                    })}
                </tbody> 
            </Table>
        )}
        {!editUserView ? "" : <div className="edit-user-view">
                <h1>{thisUser.firstName} {thisUser.lastName}</h1>
                <div className="dual-inputs">
                    <div>
                        <label>Firstname: </label><br/>
                        <input 
                        type="text" 
                        id="firstName"
                        defaultValue={thisUser.firstName}
                        onChange={(event) => updateField(event.target.value, event.target.id)}></input>
                    </div>
                    <div>
                        <label>Lastname: </label><br/>
                        <input type="text" defaultValue={thisUser.lastName}></input>
                    </div>
                </div>
                
                <div className="dual-inputs">
                    <div>
                        <label>Email: </label><br/>
                        <input type="text" defaultValue={thisUser.email}></input>
                    </div>
                    <div>
                        <label>Date of birth: </label><br/>
                        <input type="text" defaultValue={thisUser.dateOfBirth}></input>
                    </div>
                </div>
                <div className="dual-inputs">
                    <div>
                        <label>Zip Code: </label><br/>
                        <input type="text" defaultValue={thisUser.zipCode}></input>
                    </div>
                    <div>
                        <label>Country: </label><br/>
                        <input type="text" defaultValue={thisUser.country}></input>
                    </div>
                </div>

                <div className="dual-inputs">
                    <div>
                        <label>Contact Number: </label><br/>
                        <input type="text" defaultValue={thisUser.contactNumber}></input>
                    </div>
                    <div>
                        <label>Role: </label><br/>
                        <input type="text" defaultValue={thisUser.role}></input>
                    </div>
                </div>

            <button onClick={handleSaveEditedUser}>Save</button>
            <button onClick={handleEditUserView}>Cancel</button>
        </div>}
    </>
    )

}

export default UserDetails;