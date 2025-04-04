import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AppBuilderLanding from "./components/AppBuilderLanding";
import PageBuilder from "./components/PageBuilder";
import StepPageBuilder from "./components/StepPageBuilder";
import StageFlowRouter from "./components/StageFlowRouter";

function App() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Routes>
        <Route
          path="/"
          element={
            showForm ? (
              <StageFlowRouter />
            ) : (
              <AppBuilderLanding onStart={() => setShowForm(true)} />
            )
          }
        />
        <Route path="/builder" element={<PageBuilder />} />
        <Route path="/builder/:stepId" element={<StepPageBuilder />} />
      </Routes>
    </div>
  );
}

export default App;
