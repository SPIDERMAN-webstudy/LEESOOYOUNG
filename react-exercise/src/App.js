import React, { useRef, useState } from "react";
import ErrorModal from "./ErrorModal";
import Wrapper from "./Wrapper";

function App() {
  const nameInputRef = useRef();
  const ageInputRef = useRef();

  const [username, setUsername] = useState("");
  const [userage, setUserage] = useState("");
  const [userlist, setUserlist] = useState([]);
  const [error, setError] = useState();
  const insertUsername = (event) => {
    setUsername(event.target.value);
  };
  const insertUserage = (event) => {
    setUserage(event.target.value);
  };
  const userRegister = (event) => {
    event.preventDefault();
    const enteredName = nameInputRef.current.value;
    const enteredAge = ageInputRef.current.value;
    if (enteredName === 0) {
      setError({
        title: "Invalid Input",
        message: "Please enter your name.",
      });
      return;
    }
    if (enteredAge === 0) {
      setError({
        title: "Invalid Input",
        message: "Please enter your age.",
      });
      return;
    }
    if (enteredAge <= 0) {
      setError({
        title: "Invalid Input",
        message: "Don't lie!",
      });
      return;
    }
    setUserlist((item) => {
      const updatedList = [{ name: enteredName, age: enteredAge }, ...item];
      return updatedList;
    });
    nameInputRef.current.value = "";
    ageInputRef.current.value = "";
  };
  const nameList = userlist.map((user) => (
    <li key={user.name}>
      {user.name} ({user.age} years old)
    </li>
  ));
  const errorHandler = () => {
    setError(null);
  };
  return (
    <React.Fragment>
      {error && (
        <ErrorModal
          title={error.title}
          message={error.message}
          onConfirm={errorHandler}
        />
      )}
      <form onSubmit={userRegister}>
        <div>
          <label> Username </label>
          <input type="text" ref={nameInputRef} />
          <label> Age (Years) </label>
          <input type="number" ref={ageInputRef} />
        </div>
        <button type="submit">Add User</button>
      </form>
      <ul>{nameList}</ul>
    </React.Fragment>
  );
}

export default App;
