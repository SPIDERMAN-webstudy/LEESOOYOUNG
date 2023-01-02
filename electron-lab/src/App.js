import { useState } from "react";
import "./App.css";

function App() {
  const [price, setPrice] = useState(0);

  fetch("http://127.0.0.1:8000/price2", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data.message);
      setPrice(data.message);
    })
    .catch((error) => console.log(error));

  // const handleClick = () => {
  //   console.log("price start");
  //   fetch("http://127.0.0.1:8000/hello", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((resp) => resp.json())
  //     .then((data) => {
  //       console.log(data.message);
  //       setPrice(data.message);
  //     })
  //     .catch((error) => console.log(error));
  //   console.log("getPrice end");
  // };

  return (
    <div id="app">
      <h2>{price}</h2>
    </div>
  );
}

export default App;
