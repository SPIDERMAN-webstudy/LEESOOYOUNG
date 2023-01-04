import { useState } from "react";
import "./App.css";

function App() {
  const [brice, setBrice] = useState(0);
  const [xrice, setXrice] = useState(0);
  const [ticker, setTicker] = useState("");

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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        signal: true,
        ticker: ticker,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data.message);
        setBrice(data.message);
      })
      .catch((error) => console.log(error));
    console.log("getPrice end");
  };

  const btcStopper = () => {
    console.log("price start");
    fetch("http://127.0.0.1:8000/price1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        signal: false,
      }),
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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        signal: true,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data.message);
        setXrice(data.message);
      })
      .catch((error) => console.log(error));
    console.log("getPrice end");
  };

  const xrpStopper = () => {
    console.log("price start");
    fetch("http://127.0.0.1:8000/price2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        signal: false,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data.message);
        setXrice(data.message);
      })
      .catch((error) => console.log(error));
    console.log("getPrice end");
  };

  const tickerHandler = (e) => {
    setTicker(e.target.value);
    console.log(ticker);
  };

  return (
    <div id="app">
      <div>
        Server 1 <button onClick={btcHandler}>BTC_START</button>
        <button onClick={btcStopper}>BTC_STOP</button>
        <div>
          심볼:{" "}
          <input type="text" onChange={tickerHandler} value={ticker}></input>
        </div>
      </div>
      {/* <div>
        Server 2<button onClick={xrpHandler}>XRP_START</button>
        <button onClick={xrpStopper}>XRP_STOP</button>
      </div>
      <h2>BTC : {brice}</h2>
      <h2>XRP : {xrice}</h2> */}
    </div>
  );
}

export default App;
