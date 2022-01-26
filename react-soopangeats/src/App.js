import { useState } from "react";
import Cart from "./components/Cart/Cart";

import Header from "./components/Layout/Header";
import Meals from "./components/Meals/Meals";
import CartProvider from "./store/CartProvider";

function App() {
  const [theshow, setTheshow] = useState(false);

  const showCartHandler = () => {
    setTheshow(true);
  };

  const hideCartHandler = () => {
    setTheshow(false);
  };

  return (
    <CartProvider>
      {theshow && <Cart onClose={hideCartHandler} />}
      <Header onShowCart={showCartHandler} />
      <main>
        <Meals />
      </main>
    </CartProvider>
  );
}

export default App;
