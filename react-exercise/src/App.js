import { useState } from "react";
import ErrorModal from "./ErrorModal";

function App() {
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
    if (username.trim().length === 0) {
      setError({
        title: "Invalid Input",
        message: "Please enter your name.",
      });
      return;
    }
    if (userage.trim().length === 0) {
      setError({
        title: "Invalid Input",
        message: "Please enter your age.",
      });
      return;
    }
    if (userage <= 0) {
      setError({
        title: "Invalid Input",
        message: "Don't lie!",
      });
      return;
    }
    setUserlist((item) => {
      const updatedList = [{ name: username, age: userage }, ...item];
      return updatedList;
    });
    setUsername("");
    setUserage("");
  };
  const nameList = userlist.map((user) => (
    <li key={user.name}>
      {user.name} {user.age}
    </li>
  ));
  const errorHandler = () => {
    setError(null);
  };
  return (
    <div>
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
          <input type="text" onChange={insertUsername} />
          <label> Age (Years) </label>
          <input type="number" onChange={insertUserage} />
        </div>
        <button type="submit">Add User</button>
      </form>
      <ul>{nameList}</ul>
    </div>
  );
}

export default App;
