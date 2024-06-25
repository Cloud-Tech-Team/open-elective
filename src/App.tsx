import { ModeToggle } from "./components/ui/mode-toggle";
import { ThemeProvider } from "./components/ui/theme-provider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login/login";
import Home from "./components/Home/Home";
import Thankyou from "./components/ThankYou/Thankyou";


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
