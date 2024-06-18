import { ModeToggle } from "./components/ui/mode-toggle";
import { ThemeProvider } from "./components/ui/theme-provider";
import Login from "./pages/Login";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="absolute right-0 p-5">
        <ModeToggle />
      </div>
      <div className="w-screen h-screen flex justify-center items-center">
        <Login />
      </div>
    </ThemeProvider>
  );
}

export default App;
