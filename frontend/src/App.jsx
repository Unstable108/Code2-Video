import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./context/socketContext";
import Home from "./pages/Home";
import Room from "./pages/Room";
import "./index.css";

function App() {
  return (
    <SocketProvider>
      <Router>
        <div className="bg-gray-100 min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/room/:id" element={<Room />} />
          </Routes>
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;
