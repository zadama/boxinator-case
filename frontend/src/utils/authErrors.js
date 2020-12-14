const AuthErrorHandling = {
  "auth/wrong-password": {
    response: "You have entered an invalid email or password",
  },
  "auth/user-not-found": {
    response: "You have entered an invalid email or password",
  },
  "auth/user-mismatch": {
    response: "The credential given does not correspond to the user.",
  },
  "auth/invalid-email": {
    response: "The email address is badly formatted.",
  },
  "auth/invalid-verification-code": {
    response: "Invalid verification code.",
  },
  "auth/missing-verification-code": {
    response: "Please enter the verification code.",
  },
  "auth/too-many-requests": {
    response: "You've made this action too many times. Please try again later!",
  },
  "auth/network-request-failed": {
    response: "Network failure! Please refresh the page and try again!",
  },
  "auth/invalid-phone-number": {
    response: "Invalid phone number format.",
  },
  "auth/missing-phone-number": {
    response: "Phone number not found.",
  },
  "auth/unverified-email": {
    response: "Make sure your email is verified before continuing!",
  },
  "auth/captcha-check-failed": {
    response: "Something went wrong, please try again or refresh the page!",
  },
  "auth/invalid-credential": {
    response: "Credentials has likely expired, please try again!",
  },
  "auth/email-already-exists": {
    response: "This email already exists.",
  },
  "auth/internal-error": {
    response: "Internal error occurred. Reach out to us if it persists.",
  },
};

export { AuthErrorHandling };
