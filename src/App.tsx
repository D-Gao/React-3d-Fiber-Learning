import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./experiences/HomeLanding/Home";
import ImageTransition from "./experiences/ImageTransition/ImageTransition";

function App() {
  return (
    <div className="h-svh w-screen">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/image" element={<ImageTransition />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
