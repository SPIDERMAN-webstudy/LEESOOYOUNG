import "./Martin.css";

const Martin = () => {
  const btcHandler = () => {
    console.log("price start");
    fetch("http://127.0.0.1:8000/price1", {
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
      })
      .catch((error) => console.log(error));
    console.log("getPrice end");
  };

  return (
    <div id="app">
      <TopMenu />
      Server 1<button onClick={btcHandler}>BTC_START</button>
      <button onClick={btcStopper}>BTC_STOP</button>
    </div>
  );
};

export default Martin;
