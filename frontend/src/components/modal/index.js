import React from "react";
import "./style.scss";
import { useRef, useState } from "react";
import useClickOuteside from "./useClickOutside";

const Modal = ({ children, isVisible, onClose }) => {
  const modalRef = useRef();

  useClickOuteside(modalRef, onClose);

  return (
    <div className="custom-overlay">
      <div
        style={{ maxHeight: "500px", overflowY: "scroll" }}
        ref={modalRef}
        className="custom-modal"
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
