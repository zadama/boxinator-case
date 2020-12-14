import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';

import "./style.scss";

import { useAuth } from "../../context/auth";
import { getAllCountries } from '../../api/countries';
import { getAllAccounts } from '../../api/user';
import EditUserModal from './userdetails/EditUserModal';
import DeleteUserModal from './userdetails/DeleteUserModal';


const UserDetails = () => {
    const auth = useAuth();
    const [data, setData] = useState(null);
    const [countries, setCountries] = useState([]);
    const [editUserView, setEditUserView] = useState(false);
    const [deleteUserView, setDeleteUserView] = useState(false);
    const [thisUser, setThisUser] = useState(null);

    const renderUserDataWithAdminToken = async () => {
        try {
            const token = await auth.getUserToken();

            const { data } = await getAllAccounts(token); 
            
            let { data: savedCountries } = await getAllCountries();

            savedCountries = savedCountries.data.map((country) => {
                return {
                    name: country.name, 
                    code: country.countryCode,
                    feeMulti: country.feeMultiplier
                };
            });

            setCountries(savedCountries);
            setData(data);
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        renderUserDataWithAdminToken();
    }, [])

    const handleEditClick = (user) => { // Called when an admin starts to edit an account
        setEditUserView(!editUserView);
        setThisUser(user);
    }

    const handleDeleteClick = (user) => { // Open modal when admin wants to delete account
        setDeleteUserView(!deleteUserView);
        setThisUser(user);
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
        <section>
            {editUserView && <EditUserModal thisUser={thisUser} countries={countries} reRender={renderUserDataWithAdminToken} />}
            {deleteUserView && <DeleteUserModal thisUser={thisUser} />}
        </section>
    </>
    )
}

export default UserDetails;