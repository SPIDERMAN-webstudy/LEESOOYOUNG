import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./routes/home";
import Detail from "./routes/detail";
import "./css/styles.module.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path={`${process.env.PUBLIC_URL}/`} element={<Home />} />
        <Route path="/movie/:id" element={<Detail />} />
      </Routes>
    </Router>
  );
}

export default App;
