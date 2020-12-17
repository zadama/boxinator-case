import React, {useState} from "react";
import Toast from "react-bootstrap/Toast";

import "./toaster.scss";

const Toaster = (props) => {

    return (
        <div className="toast-container" aria-live="polite" aria-atomic="true">
                <Toast className={ props.toastHeaderMsg ==="Error" ? "error-toast" : "success-toast"}
                        onClose={props.onClose} delay={3500} autohide>
                    <Toast.Header>
                        <strong className="mr-auto">{props.toastHeaderMsg}</strong>
                        <small>just now</small>
                    </Toast.Header>
                    <Toast.Body>
                        <p className={props.toastHeaderMsg === "Error" ? "error-message" : "success-message"}>
                            {props.toastMsg}</p>
                    </Toast.Body>
                </Toast>
        </div>
    );
};

export default Toaster;