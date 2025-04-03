import { Routes, Route } from "react-router-dom";
import AppBuilderLanding from "./components/AppBuilderLanding";
import PageBuilder from "./components/PageBuilder";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppBuilderLanding />} />
      <Route path="/builder" element={<PageBuilder />} />
    </Routes>
  );
}

export default App;
