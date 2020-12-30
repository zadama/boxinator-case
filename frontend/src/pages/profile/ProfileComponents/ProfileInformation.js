import React, { useState, useEffect } from 'react'; 
import { Button } from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast';


import { useAuth } from "../../../context/auth";
import { getAccount } from '../../../api/user';
import { getAllCountries } from '../../../api/countries';
import EditAccountModal from '../../admin/AccountPageModals/EditAccountModal';

const ProfileInformation = props => {
    
    const auth = useAuth();
    const [data, setData] = useState(null);
    const [countries, setCountries] = useState([]);
    const [editAccountView, setEditAccountView] = useState(false);
    const [thisAccount, setThisAccount] = useState(null);

    const [toast, setToast] = useState(false);
    const [toastMsg, setToastMsg] = useState("");

    const renderProfileInformationWithToken = async () => {
        try {
            const token = await auth.getUserToken();

            const { data: thisAccount } = await getAccount(token, auth.user.email);
            let { data: savedCountries } = await getAllCountries();

            savedCountries = savedCountries.data.map((country) => {
                return [country.name];
            });

            setCountries(savedCountries);
            setData(thisAccount.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        renderProfileInformationWithToken();
    }, []);

    const handleEditClick = (account) => { // Open modal when admin wants to edit an account
        setEditAccountView(!editAccountView);
        setThisAccount(account);
    }

    const toggleToast = (action) => {
        setToastMsg(action);
        setToast(true);
    }

    return (
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
                    <div className="profile-content">
                        <div>
                            <label htmlFor="id">Account ID </label>
                            <p>{data.id}</p>
                        </div>
                        <div>
                            <label htmlFor="email">Email </label>
                            <p>{data.email}</p>
                        </div>
                        <div>
                            <label htmlFor="firstName">Firstname </label>
                            <p>{data.firstName}</p>
                        </div>
                        <div>
                            <label htmlFor="lastName">Lastname </label>
                            <p>{data.lastName}</p>
                        </div>
                        <div>
                            <label htmlFor="dateOfBirth">Date of birth </label>
                            <p>{data.dateOfBirth}</p>
                        </div>
                        <div>
                            <label htmlFor="country">Country </label>
                            <p>{data.country}</p>
                        </div>
                        <div>
                            <label htmlFor="contactNumber">Contact number </label>
                            <p>{data.contactNumber}</p>
                        </div>
                        <div>
                            <label htmlFor="zipCode">Zip code </label>
                            <p>{data.zipCode}</p>
                        </div>
                        
                    </div>
                    <div className="profile-buttons">
                        <Button onClick={() => handleEditClick(data)}>edit</Button>
                        <Button onClick={async () => {
                            await auth.logout();
                        }}>logout</Button>
                    </div>
                </>)}
                {editAccountView && <EditAccountModal onClose={() => setEditAccountView(!editAccountView)} countries={countries} thisAccount={thisAccount} toggleToast={toggleToast} reRender={renderProfileInformationWithToken}/>}
        </>
    )
}

export default ProfileInformation;