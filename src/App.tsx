import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Home from "./pages/Home/Home";
import Thankyou from "./pages/ThankYou/Thankyou";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/Registered" element={<Thankyou />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
