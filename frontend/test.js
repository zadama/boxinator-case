function validate(email, password) {
  return {
    email: email.length === 0, //true if email is empty
    password: password.length === 0, //true if password is empty
  };
}

const errors = validate("", "asdasd");
const isDisabled = Object.keys(errors).some((x) => errors[x] === true);
console.log(isDisabled);
