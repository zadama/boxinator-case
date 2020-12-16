import React, { useRef, useState, useEffect } from "react";

import "../style.scss";

import Modal from "../../../components/modal";
import { AuthErrorHandling } from "../../../utils/authErrors";

const Enroll2FA = ({ onClose, initialNumber, firebase, onSuccess }) => {
  const recaptchaWrapperRef = useRef();
  const modalRef = useRef();
  const hasEnrolled2Fa = useRef(false);

  const verificationVerifier = useRef();
  const [phoneNbr, setPhoneNbr] = useState(initialNumber ? initialNumber : "");
  const [verificationCode, setVerificationCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [showEnterVerificationCode, setEnterVerificationCode] = useState(null);

  // Hämta användaren, ifall email är un-verified ha loader och i
  // useEffect captchan ha emailNotVerified typ som dependencyn och endast
  // när den verifieras så kör koden.

  const handleSendPhoneVerification = async () => {
    // In case we have alreay registered, clear the recaptchaVerifier
    // and also re-initialize the div element inside recaptchaWrapperRef.
    // Otherwise we'll get "Captcha already rendered" error.
    if (window.recaptchaVerifier && recaptchaWrapperRef) {
      window.recaptchaVerifier.clear();
      recaptchaWrapperRef.current.innerHTML = `<div id="recaptcha-container"></div>`;
    }

    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: function (response) {
          console.log("[CAPTCHA RESOLVED]");
        },
      }
    );

    try {
      /*
      let user = await firebase.auth().currentUser.reload();

      user = await firebase.auth().currentUser;

      if (!isFirstTime.current && !user.emailVerified) {
        throw new Error("auth/unverified-email");
      }

      isFirstTime.current = false;*/

      const session = await firebase
        .auth()
        .currentUser.multiFactor.getSession();

      const phoneOpts = {
        phoneNumber: `${phoneNbr}`,
        session,
      };

      const phoneAuthProvider = new firebase.auth.PhoneAuthProvider();

      verificationVerifier.current = await phoneAuthProvider.verifyPhoneNumber(
        phoneOpts,
        window.recaptchaVerifier
      );

      setEnterVerificationCode(true);
    } catch (error) {
      console.log(error);

      const errorHandler = AuthErrorHandling[error.code];

      if (errorHandler != null) {
        setErrorMessage({ code: error.code, response: errorHandler.response });
      }

      if (error.code === "auth/requires-recent-login") {
        // Re-authenticate user.
        /**
         * var user = firebase.auth().currentUser;
var credential = firebase.auth.EmailAuthProvider.credential(user.email, password);

// Prompt the user to re-provide their sign-in credentials
return user.reauthenticateWithCredential(credential);
         */
      }
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

    const user = firebase.auth().currentUser;
    try {
      await user.multiFactor.enroll(multiFactorAssertion, "phone number");

      hasEnrolled2Fa.current = true;

      alert("enrolled in MFA");

      onSuccess();
    } catch (error) {
      console.log(error);
      const errorHandler = AuthErrorHandling[error.code];

      if (errorHandler != null) {
        setErrorMessage({ code: error.code, response: errorHandler.response });
      }
    }
  };

  const onDeleteUser = async () => {
    const user = await firebase.auth().currentUser;
    if (user) {
      await user.delete(); // can throw, requires recent login (after looong break.)
    }
  };

  // When the user leaves the page before enrolling 2Fa, we delete the account
  const handleLeavePage = (e) => {
    if (!hasEnrolled2Fa.current) {
      onDeleteUser();
    }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleLeavePage);

    return () => {
      // if user closes the modal without completing the 2FA, we delete the account.
      if (!hasEnrolled2Fa.current) {
        onDeleteUser();
      }

      window.removeEventListener("beforeunload", handleLeavePage);

      // check if failed2Auth, if true, delete user...
      // remove useClickouteside from registermodal (THIS)
      // handle the div:nthchiild(2), make it more specefic to login, registermodals and not indexmodal.
    };
  }, [hasEnrolled2Fa]);

  /**
   *  {errorMessage && (
        <Alert message={errorMessage.response} onClose={closeAlert} variant={"danger"} />
      )}
   */

  return (
    <Modal onClose={onClose}>
      <div ref={recaptchaWrapperRef}>
        <div style={{ display: "none" }} id="recaptcha-container"></div>
      </div>

      {errorMessage && (
        <>
          {errorMessage.code === "auth/unverified-email" &&
            !showEnterVerificationCode && (
              <section
                className="resend-code"
                style={{ width: "100%", padding: "20px" }}
              >
                <p className="error-message">{errorMessage.response}</p>

                <button
                  onClick={() => {
                    firebase.auth().currentUser.sendEmailVerification();
                  }}
                >
                  Resend the email
                </button>
              </section>
            )}

          {(errorMessage.code === "auth/invalid-phone-number" ||
            errorMessage.code === "auth/invalid-verification-code") && (
            <section
              className="resend-code"
              style={{ width: "100%", padding: "20px" }}
            >
              <p className="error-message">{errorMessage.response}</p>
            </section>
          )}
        </>
      )}

      {showEnterVerificationCode ? (
        <div className="phone-container">
          <h4>Enter verification code</h4>
          <input
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
          </button>

          <section className="resend-code">
            <p>Resend verification code</p>
            <button
              onClick={() => {
                setEnterVerificationCode(false);
                setErrorMessage(null);
              }}
            >
              Resend
            </button>
          </section>
        </div>
      ) : (
        <div className="phone-container">
          <h4>Enter your Phone number</h4>

          <section>
            {/*
             ha dropdown select inuti (position absolute på span och padding-left: 20px något på input) där man kan välja phoneCode
             <span>+46</span>*/}

            <input
              placeholder="e.g. +46727124185"
              value={phoneNbr}
              onChange={(e) => {
                setPhoneNbr(e.target.value);
              }}
            ></input>
          </section>

          <button
            onClick={() => {
              handleSendPhoneVerification();
            }}
            className="btn"
          >
            Send verification code
          </button>
        </div>
      )}
    </Modal>
  );
};

export default Enroll2FA;
