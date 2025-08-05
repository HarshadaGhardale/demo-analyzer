import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResumeUploader from "./ResumeUploader";
import AnalysisPage from "./AnalysisPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ResumeUploader />} />
        <Route path="/analysis" element={<AnalysisPage />} />
      </Routes>
    </Router>
  );
}

export default App;