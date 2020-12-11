import React from "react";
import { useEffect } from "react";
import { useRef, useState } from "react";

import "./style.scss";
import Loader from "../../components/loader";
import useClickOuteside from "./useClickOutside";

const LoginModal = ({ children, onClose, firebase, resolver }) => {
  const recaptchaWrapperRef = useRef();
  const modalRef = useRef();

  useClickOuteside(modalRef, onClose);

  let captchaVerifier = useRef();
  const verificationVerifier = useRef();
  const [phoneNbr, setPhoneNbr] = useState(0);
  const [verificationCode, setVerificationCode] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  // sätt captchan som i index.modal

  useEffect(() => {
    handleSendPhoneVerification();
  }, []);

  const handleSendPhoneVerification = async () => {
    if (window.recaptchaVerifier && recaptchaWrapperRef) {
      window.recaptchaVerifier.clear();
      recaptchaWrapperRef.current.innerHTML = `<div id="recaptcha-container"></div>`;
    }

    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: function (response) {
          console.log("[CAPTCHA RESOLVED]", response);
        },
      }
    );

    try {
      const phoneOpts = {
        multiFactorHint: resolver.hints[0],
        session: resolver.session,
      };

      const phoneAuthProvider = new firebase.auth.PhoneAuthProvider();

      verificationVerifier.current = await phoneAuthProvider.verifyPhoneNumber(
        phoneOpts,
        window.recaptchaVerifier
      );

      alert("sms text sent!");
    } catch (error) {
      if (error.code) {
        setErrorMessage(error.code.substring(5));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationCode = async () => {
    const cred = new firebase.auth.PhoneAuthProvider.credential(
      verificationVerifier.current,
      verificationCode
    );

    const multiFactorAssertion = firebase.auth.PhoneMultiFactorGenerator.assertion(
      cred
    );

    // Below makes the user log in automatically (authStateChanged -> handleUser)
    try {
      await resolver.resolveSignIn(multiFactorAssertion);
    } catch (error) {
      console.log(error);
    }
  };

  // Ha en loader vid   user.isEmailVerified == null
  // eller notifiera att användaren måste verifiera först innan 2factor

  return (
    <div className="custom-overlay">
      <div ref={modalRef} className="custom-modal">
        <div ref={recaptchaWrapperRef}>
          <div style={{ display: "none" }} id="recaptcha-container"></div>
        </div>
        {!isLoading && errorMessage == null ? (
          <div>
            <h4>Enter the verification code that was sent to your Phone</h4>
            <input
              placeholder="Verification code"
              value={verificationCode}
              onChange={(e) => {
                setVerificationCode(e.target.value);
              }}
            ></input>
            <button
              onClick={() => {
                handleVerificationCode();
              }}
            >
              Submit
            </button>{" "}
          </div>
        ) : !isLoading && errorMessage != null ? (
          <div>{errorMessage} - Please try again later...</div>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default LoginModal;
