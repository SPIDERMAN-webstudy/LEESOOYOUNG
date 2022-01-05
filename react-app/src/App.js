import { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  const [pay, setPay] = useState(1);
  useEffect(() => {
    fetch("https://api.coinpaprika.com/v1/tickers")
      .then((response) => response.json())
      .then((json) => {
        setCoins(json);
        setLoading(false);
        console.log(json);
      });
  }, []);
  const [budget, setBudget] = useState("");
  const onChange = (event) => {
    setBudget(event.target.value);
  };
  const BTC = (event) => {
    setPay(event.target.value);
    setBudget("");
  };
  return (
    <div>
      <h1>DownBit</h1>
      {loading ? (
        <strong>Loading...</strong>
      ) : (
        <div>
          <select onChange={BTC}>
            {coins.map((coin, name) => (
              <option key={name} value={coin.quotes.USD.price}>
                {coin.name} : ${coin.quotes.USD.price} USD
              </option>
            ))}
          </select>
          <hr />
          <input
            onChange={onChange}
            value={budget}
            type="number"
            placeholder="Show me the money"
          />
          $<h2>{budget / pay}</h2>
        </div>
      )}
    </div>
  );
}

export default App;
