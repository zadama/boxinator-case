import React, { useState } from 'react';
import Modal from '../../../components/modal/index';
import { useAuth } from '../../../context/auth';
import { deleteAccount } from '../../../api/user';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashAlt} from "@fortawesome/free-solid-svg-icons";

import "../style.scss";

const DeleteAccountModal = (props) => {

    const auth = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [deleteBtn, setDeleteBtn] = useState(false);
    const [id, setId] = useState(props.account.id);
/*
    const deleteUser = async (account) => {
        try {
            const token = await auth.getUserToken(); // Get sessiontoken
            await deleteAccount(token, account.id); // Pass token and pathvariable
            props.reRender();
            props.toggleToast("deleted");
        } catch (error) {
            console.log(error);
        } finally {
            onClose();
        }
    }

 */

    const deleteAccount = () => {
        props.deleteUser(props.account.id);
        setShowModal(false);
    }

    const validateInput = (input) => { // Check if input matches the requested string, if not disable button
        if(input === props.account.email) setDeleteBtn(!deleteBtn);
    }

    const onClose = () => {
        setShowModal(false);
    }

    return (
        <>
            <button
                className="btn-danger btn-sm ml-2"
                onClick={() => setShowModal(true)}
            >
                <FontAwesomeIcon icon={faTrashAlt} />
            </button>

            {showModal && (<Modal onClose={onClose}>
                <h5>Are you sure?</h5>
                <p>Are you sure you want to delete the account with <strong> id: {id}? </strong>
                    Provide this phrase to confirm delete: <strong>{props.account.email}</strong></p>
                <form>
                    <input
                        type="text"
                        onChange={(event) => validateInput(event.target.value)}/>
                    <div className="text-center">
                        <button className="btn btn-danger btn-sm"
                                disabled={!deleteBtn}
                                type="button"
                                onClick={deleteAccount}
                        >
                            Delete user account
                        </button>
                        <button
                            className="btn btn-light btn-sm ml-2"
                            type="button"
                            onClick={onClose}>
                            <strong>Cancel</strong>
                        </button>
                    </div>
                </form>
            </Modal>)}
        </>
    )
}

export default DeleteAccountModal;