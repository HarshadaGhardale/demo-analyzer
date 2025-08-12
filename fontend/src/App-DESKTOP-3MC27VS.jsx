import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResumeUploader from "./Pages/ResumeUploader";
import AnalysisPage from "./Pages/AnalysisPage";
import ContactPage from "./Pages/Contact";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ResumeUploader />} />
        <Route path="/analysis" element={<AnalysisPage/>} />
        <Route path="/contact" element={<ContactPage/>}
      </Routes>
    </Router>
  );
}

export default App;