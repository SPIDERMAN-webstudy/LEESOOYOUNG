import { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  const [cost, setCost] = useState(1);
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
    setCost(parseInt(event.target.value));
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
              <option key={name} value={name}>
                {coin.name} ({coin.symbol}) : ${coin.quotes.USD.price} USD
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
          $
          <h2>
            {budget / coins[cost].quotes.USD.price} {coins[cost].symbol}
          </h2>
        </div>
      )}
    </div>
  );
}

export default App;
