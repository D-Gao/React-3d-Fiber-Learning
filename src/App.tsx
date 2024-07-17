import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./experiences/HomeLanding/Home";
import ImageTransition from "./experiences/ImageTransition/ImageTransition";
import Portal from "./experiences/Portal/Portal";

function App() {
  return (
    <div className="h-svh w-screen">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/image" element={<ImageTransition />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
