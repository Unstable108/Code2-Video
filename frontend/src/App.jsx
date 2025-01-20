import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./context/socketContext";
import Home from "./pages/Home";
import Room from "./pages/Room";
import "./index.css";
import RoomTest from "./pages/RoomTest";
import RoomNew from "./pages/RoomNew";

function App() {
  return (
    <SocketProvider>
      <Router>
        <div className="bg-gray-100 min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/room/:id" element={<Room />} />
            <Route path="/roomtest" element={<RoomTest />} />
            <Route path="/newroom" element={<RoomNew />} />
          </Routes>
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;
