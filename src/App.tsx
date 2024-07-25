import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./experiences/HomeLanding/Home";
import ImageTransition from "./experiences/ImageTransition/ImageTransition";
import Portal from "./experiences/Portal/Portal";
import Dissolve from "./experiences/Dissolve/Dissolve";
import Controls from "./experiences/Controls/Controls";
import Particles from "./experiences/Particles/Particles";
import Earth from "./experiences/Earth/Earth";
import EarthV2 from "./experiences/EarthV2/EarthV2";
import Coffee from "./experiences/Coffee/Coffee";

function App() {
  return (
    <div className="h-svh w-screen">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/image" element={<ImageTransition />} />
          <Route path="/dissolve" element={<Dissolve />} />
          <Route path="/controls" element={<Controls />} />
          <Route path="/particles" element={<Particles />} />
          <Route path="/earth" element={<Earth />} />
          <Route path="/earthv2" element={<EarthV2 />} />
          <Route path="/coffee" element={<Coffee />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
