import React, { useRef, useState, useEffect } from "react";

import "../style.scss";

import Modal from "../../../components/modal";
import { AuthErrorHandling } from "../../../utils/authErrors";
import PageLoader from "../../../components/loader";
import Alert from "../../../components/alert";

const Enroll2FA = ({ onClose, initialNumber, firebase, onSuccess }) => {
  const recaptchaWrapperRef = useRef();
  const modalRef = useRef();
  const hasEnrolled2Fa = useRef(false);

  const verificationVerifier = useRef();
  const [phoneNbr, setPhoneNbr] = useState(initialNumber ? initialNumber : "");
  const [verificationCode, setVerificationCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
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

      console.log("hasenrolled2fa to true", hasEnrolled2Fa);

      alert("enrolled in MFA");

      onSuccess();
    } catch (error) {
      console.log(error);
      const errorHandler = AuthErrorHandling[error.code];

      if (errorHandler != null) {
        setErrorMessage({ code: error.code, response: errorHandler.response });
      }

      setIsLoading(false);
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

  // This modal should not be closeable. This to avoid deleting the user if he/she
  // by mistake clicks outside the modal.
  return (
    <Modal onClose={() => {}}>
      <div ref={recaptchaWrapperRef}>
        <div style={{ display: "none" }} id="recaptcha-container"></div>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : (
        <>
          {errorMessage && (
            <>
              {(errorMessage.code === "auth/invalid-phone-number" ||
                errorMessage.code === "auth/invalid-verification-code") && (
                <Alert
                  message={errorMessage.response}
                  onClose={() => {
                    setErrorMessage("");
                  }}
                  expire={3000}
                  variant={"danger"}
                />
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
                <p>Didn't receive the verification code? </p>
                <button
                  style={{ width: "auto" }}
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
              <p>
                You must enable two-factor authentication to complete the
                registration. Press the button and we will send a verification
                code to your number.
              </p>
              <p>
                NOTE: you have to confirm your email <strong>first</strong>,
                before we can enroll you with two-factor authentication.
              </p>
              <section>
                {/*
             ha dropdown select inuti (position absolute på span och padding-left: 20px något på input) där man kan välja phoneCode
             <span>+46</span>*/}

                {initialNumber != null ? (
                  <input
                    placeholder="e.g. +46727124185"
                    value={phoneNbr}
                    readOnly
                  ></input>
                ) : (
                  <input
                    placeholder="e.g. +46727124185"
                    value={phoneNbr}
                    onChange={(e) => {
                      // This can be removed completely. Only useful
                      // if we have some kind of "send code to different number" and by
                      // that we toggle from readOnly to alterable.
                      let value = e.target.value;
                      if (Number(value)) {
                        setPhoneNbr(value);
                      }
                    }}
                  ></input>
                )}
              </section>

              <button
                onClick={() => {
                  handleSendPhoneVerification();
                }}
                className="btn"
              >
                Send verification code
              </button>

              {errorMessage &&
                errorMessage.code === "auth/unverified-email" &&
                !showEnterVerificationCode && (
                  <section
                    className="resend-code"
                    style={{ width: "100%", paddingBottom: "20px" }}
                  >
                    <p className="error-message">{errorMessage.response}</p>

                    <button
                      style={{ width: "auto", marginLeft: "8px" }}
                      onClick={() => {
                        firebase.auth().currentUser.sendEmailVerification();
                      }}
                    >
                      Resend
                    </button>
                  </section>
                )}
            </div>
          )}{" "}
        </>
      )}
    </Modal>
  );
};

export default Enroll2FA;
