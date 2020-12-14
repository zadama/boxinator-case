import React from "react";
import { useEffect } from "react";
import { useRef, useState } from "react";
import { AuthErrorHandling } from "../../utils/authErrors";

import "./style.scss";
import useClickOuteside from "./useClickOutside";

const RegisterModal = ({
  children,
  onClose,
  initialNumber,
  firebase,
  onSuccess,
}) => {
  const recaptchaWrapperRef = useRef();
  const modalRef = useRef();
  const isFirstTime = useRef(true);

  useClickOuteside(modalRef, onClose);

  let captchaVerifier = useRef();
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
      const errorHandler = AuthErrorHandling[error.code];

      if (errorHandler != null) {
        setErrorMessage(errorHandler.response);
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

      alert("enrolled in MFA");

      onSuccess();
    } catch (error) {
      const errorHandler = AuthErrorHandling[error.code];

      if (errorHandler != null) {
        setErrorMessage(errorHandler.response);
      }
    }
  };

  // notifiera att användaren måste verifiera först innan 2factor

  return (
    <div className="custom-overlay">
      <div ref={modalRef} className="custom-modal">
        <div ref={recaptchaWrapperRef}>
          <div style={{ display: "none" }} id="recaptcha-container"></div>
        </div>

        {errorMessage && (
          <>
            {errorMessage === "auth/unverified-email" ? (
              <section
                className="resend-code"
                style={{ width: "100%", padding: "20px" }}
              >
                <p className="error-message">
                  Did the verification email not work? Try again.
                </p>

                <button
                  onClick={() => {
                    firebase.auth().currentUser.sendEmailVerification();
                  }}
                >
                  Resend the email
                </button>
              </section>
            ) : (
              <section className="resend-code">
                <p className="error-message">
                  Wrong code entered, please resend and try again!
                </p>
              </section>
            )}
          </>
        )}

        {showEnterVerificationCode ? (
          <div>
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
          <div>
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
      </div>
    </div>
  );
};

export default RegisterModal;
/*
const currentUser = firebase.auth().currentUser;

currentUser.multiFactor
  .getSession()
  .then(function (multiFactorSession) {
    // Specify the phone number and pass the MFA session.
    var phoneInfoOptions = {
      phoneNumber: phoneNumber,
      session: multiFactorSession,
    };
    var phoneAuthProvider = new firebase.auth.PhoneAuthProvider();
    // Send SMS verification code.
    return phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, appVerifier);
  })
  .then(function (verificationId) {
    // Ask user for the verification code.
    var verificationCode = window.prompt(
      "Please enter the verification " +
        "code that was sent to your mobile device."
    );
    var cred = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      verificationCode
    );
    var multiFactorAssertion = firebase.auth.PhoneMultiFactorGenerator.assertion(
      cred
    );
    // Complete enrollment.
    return currentUser.multiFactor.enroll(multiFactorAssertion);
  });


var provider = new firebase.auth.PhoneAuthProvider();
provider
  .verifyPhoneNumber("+46729266205", appVerifier)
  .then(function (verificationId) {
    console.log("HERERKLDAS");

    var verificationCode = window.prompt(
      "Please enter the verification " +
        "code that was sent to your mobile device."
    );
    return firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      verificationCode
    );
  })
  .then(function (phoneCredential) {
    return user.updatePhoneNumber(phoneCredential);
  });
} catch (error) {}
*/
