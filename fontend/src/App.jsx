import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResumeUploader from "./Pages/ResumeUploader";
import AnalysisPage from "./Pages/AnalysisPage";
import ContactPage from "./Pages/Contact";
import Signup from "./Pages/Signup";
import LoginPage from "./Pages/LoginPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ResumeUploader />} />
        <Route path="/analysis" element={<AnalysisPage/>} />
        <Route path="/contact" element={<ContactPage/>} />
        <Route path="/signup"   element={<Signup/>}/>
        <Route path="/login"   element={<LoginPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;