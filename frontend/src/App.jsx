import { BrowserRouter as Router, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Room from "./pages/Room";
import Navbar from "./components/Navbar";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:id" element={<Room />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
