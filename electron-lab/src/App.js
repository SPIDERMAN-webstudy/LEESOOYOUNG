import { useState } from "react";
import "./App.css";

function App() {
  const [brice, setBrice] = useState(0);
  const [ticker, setTicker] = useState("");
  const [cross, setCross] = useState("fixed");

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

  const tickerHandler = (e) => {
    setTicker(e.target.value);
    console.log(ticker);
  };

  const crossHandler = (e) => {
    console.log(e.target.value);
    setCross(e.target.value);
    console.log(cross);
  };

  return (
    <div id="app">
      <div>
        <div>
          심볼:{" "}
          <input type="text" onChange={tickerHandler} value={ticker}></input>
        </div>
        <div>
          <input
            type="radio"
            name="chk_info"
            value="crossed"
            onChange={crossHandler}
          />
          교차/cross
          <input
            type="radio"
            name="chk_info"
            value="fixed"
            onChange={crossHandler}
            checked={true}
          />
          격리/isolated
        </div>
        <button onClick={btcHandler}>반복시작</button>
        <button onClick={btcStopper}>정지</button>
      </div>
    </div>
  );
}

export default App;
