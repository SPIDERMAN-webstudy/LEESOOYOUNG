import { useReducer } from "react";

const initialState = {
  value: "",
  isTouched: false,
};

const valueInput = (state, action) => {
  if (action.type === "INPUT") {
    return { value: action.value, isTouched: true };
  }
  if (action.type === "BLUR") {
    return { isTouched: true, value: state.value };
  }
  if (action.type === "RESET") {
    return { value: "", isTouched: false };
  }
};

const useInput = (validateValue) => {
  const [inputValue, dispatch] = useReducer(valueInput, initialState);

  const valueIsValid = validateValue(inputValue.value);
  const hasError = !valueIsValid && inputValue.isTouched;

  const valueChangeHandler = (event) => {
    dispatch({ type: "INPUT", value: event.target.value });
  };

  const inputBlurHandler = () => {
    dispatch({ type: "BLUR" });
  };

  const reset = () => {
    dispatch({ type: "RESET" });
  };

  return {
    value: inputValue.value,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
    reset,
  };
};

export default useInput;
