import React, { useRef, useState, useEffect } from "react";

import "../style.scss";

import { AuthErrorHandling } from "../../../utils/authErrors";

import Loader from "../../../components/loader";
import Alert from "../../../components/alert";
import Modal from "../../../components/modal";

const Login2Fa = ({ children, onClose, firebase, resolver }) => {
  const recaptchaWrapperRef = useRef();

  const verificationVerifier = useRef();
  const [verificationCode, setVerificationCode] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

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
        callback: function (response) {},
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
      const errorHandler = AuthErrorHandling[error.code];
      if (errorHandler != null) {
        setErrorMessage(errorHandler.response);

        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
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
      const errorHandler = AuthErrorHandling[error.code];
      if (errorHandler != null) {
        alert(errorHandler.response);
      }
    }
  };

  return (
    <Modal onClose={onClose}>
      <div ref={recaptchaWrapperRef}>
        <div style={{ display: "none" }} id="recaptcha-container"></div>
      </div>
      {errorMessage && (
        <Alert
          message={errorMessage}
          onClose={() => {
            setErrorMessage("");
          }}
          variant={"danger"}
        />
      )}
      {!isLoading ? (
        <div className="phone-container">
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
      ) : (
        <Loader />
      )}
    </Modal>
  );
};

export default Login2Fa;
