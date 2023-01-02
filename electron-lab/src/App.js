import { useState } from "react";
import "./App.css";

function App() {
  const [brice, setBrice] = useState(0);
  const [xrice, setXrice] = useState(0);

  // fetch("http://127.0.0.1:8000/price1", {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // })
  //   .then((resp) => resp.json())
  //   .then((data) => {
  //     console.log(data.message);
  //     setPrice(data.message);
  //   })
  //   .catch((error) => console.log(error));

  const btcHandler = () => {
    console.log("price start");
    fetch("http://127.0.0.1:8000/price1", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      item: {
        signal: true,
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data.message);
        setBrice(data.message);
      })
      .catch((error) => console.log(error));
    console.log("getPrice end");
  };

  const xrpHandler = () => {
    console.log("price start");
    fetch("http://127.0.0.1:8000/price2", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data.message);
        setXrice(data.message);
      })
      .catch((error) => console.log(error));
    console.log("getPrice end");
  };

  return (
    <div id="app">
      <div>
        Server 1<button onClick={btcHandler}>BTC_START</button>
        <button>BTC_STOP</button>
      </div>
      <div>
        Server 2<button onClick={xrpHandler}>XRP_START</button>
        <button>XRP_STOP</button>
      </div>
      <h2>BTC : {brice}</h2>
      <h2>XRP : {xrice}</h2>
    </div>
  );
}

export default App;
