import useInput from "../hooks/use-input";

const BasicForm = () => {
  const {
    value: enteredFirstName,
    isValid: enteredFirstNameIsValid,
    hasError: enteredFirstNameHasError,
    valueChangeHandler: firstnameChangedHandler,
    inputBlurHandler: firstnameBlurHandler,
    reset: resetFirstNameInput,
  } = useInput((value) => value.trim() !== "");

  const {
    value: enteredLastName,
    isValid: enteredLastNameIsValid,
    hasError: enteredLastNameHasError,
    valueChangeHandler: lastnameChangedHandler,
    inputBlurHandler: lastnameBlurHandler,
    reset: resetLastNameInput,
  } = useInput((value) => value.trim() !== "");

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: enteredEmailHasError,
    valueChangeHandler: emailChangedHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmailInput,
  } = useInput((value) => value.includes("@"));

  let formIsValid = false;

  if (
    enteredEmailIsValid &&
    enteredFirstNameIsValid &&
    enteredLastNameIsValid
  ) {
    formIsValid = true;
  }

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    console.log(enteredFirstName);
    console.log(enteredLastName);
    console.log(enteredEmail);

    resetFirstNameInput();
    resetLastNameInput();
    resetEmailInput();
  };

  return (
    <form onSubmit={formSubmissionHandler}>
      <div className="control-group">
        <div className="form-control">
          <label htmlFor="name">First Name</label>
          <input
            type="text"
            id="firstname"
            onChange={firstnameChangedHandler}
            onBlur={firstnameBlurHandler}
            value={enteredFirstName}
          />
          {enteredFirstNameHasError && <p>빈칸이잖아 임마</p>}
        </div>
        <div className="form-control">
          <label htmlFor="name">Last Name</label>
          <input
            type="text"
            id="lastname"
            onChange={lastnameChangedHandler}
            onBlur={lastnameBlurHandler}
            value={enteredLastName}
          />
          {enteredLastNameHasError && <p>이름 똑바로 써라</p>}
        </div>
      </div>
      <div className="form-control">
        <label htmlFor="name">E-Mail Address</label>
        <input
          type="text"
          id="name"
          onChange={emailChangedHandler}
          onBlur={emailBlurHandler}
          value={enteredEmail}
        />
        {enteredEmailHasError && <p>이메일이 이게 맞아?</p>}
      </div>
      <div className="form-actions">
        <button disabled={!formIsValid}>Submit</button>
      </div>
    </form>
  );
};

export default BasicForm;
