import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home.tsx";
import Thankyou from "./pages/ThankYou/Thankyou";
// import Login from "./pages/Login/Login";



function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={ <Login/> } /> */}
          <Route path="/home" element={<Home />} />
          <Route path="/Registered" element={<Thankyou />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
