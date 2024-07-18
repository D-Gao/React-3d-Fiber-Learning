import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./experiences/HomeLanding/Home";
import ImageTransition from "./experiences/ImageTransition/ImageTransition";
import Portal from "./experiences/Portal/Portal";
import Dissolve from "./experiences/Dissolve/Dissolve";

function App() {
  return (
    <div className="h-svh w-screen">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/image" element={<ImageTransition />} />
          <Route path="/dissolve" element={<Dissolve />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
