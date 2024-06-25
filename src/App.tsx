import { ModeToggle } from "./components/ui/mode-toggle";
import { ThemeProvider } from "./components/ui/theme-provider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/login";
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
