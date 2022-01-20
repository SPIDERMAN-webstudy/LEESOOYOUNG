import { useEffect, useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [userage, setUserage] = useState("");
  const [userlist, setUserlist] = useState([]);
  const insertUsername = (event) => {
    setUsername(event.target.value);
  };
  const insertUserage = (event) => {
    setUserage(event.target.value);
  };
  const userRegister = (event) => {
    event.preventDefault();
    if (username.trim().length === 0) {
      alert("Please enter your name.");
      return;
    }
    if (userage.trim().length === 0) {
      alert("Please enter your age.");
      return;
    }
    if (userage < 0) {
      alert("Don't lie!");
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
  return (
    <div>
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
