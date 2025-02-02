import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./context/socketContext";
import Home from "./pages/Home";
import "./index.css";

// Lazy load components
const Room = lazy(() => import("./pages/Room"));
const RoomTest = lazy(() => import("./pages/RoomTest"));
const RoomNew = lazy(() => import("./pages/RoomNew"));
const CameraToggle = lazy(() => import("./pages/CameraToggle"));

function App() {
  return (
    <SocketProvider>
      <Router>
        <div className="bg-gray-100 min-h-screen">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/room/:id" element={<Room />} />
              <Route path="/roomtest" element={<RoomTest />} />
              <Route path="/newroom" element={<RoomNew />} />
              <Route path="/Camtest" element={<CameraToggle />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;
