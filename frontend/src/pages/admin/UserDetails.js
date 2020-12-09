import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { getAllAccounts } from '../../api/user';

import { useAuth } from "../../context/auth";


const UserDetails = () => {
    const auth = useAuth();
    const [data, setData] = useState(null);
    const [users, setUsers] = useState(null);

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
        //if(data != null) setUsers(data.data);
    }, [])
    
    // const user = users != null ? users.map(function(u){
    //     return <tr>
    //         <td>{u.id}</td>
    //     </tr>
    // }) : "test";


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
                                <td>{user.shipments}</td>
                            </tr>
                    })}
                </tbody> 
            </Table>
        )}
    </>
    )

}

export default UserDetails;