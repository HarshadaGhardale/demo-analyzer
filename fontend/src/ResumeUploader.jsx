import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResumeUploader = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a resume!");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await axios.post("http://localhost:5000/analyze-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/analysis", { state: res.data });
    } catch (err) {
      console.error(err);
      alert("Error analyzing resume");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Resume Analyzer</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <button type="submit">Upload & Analyze</button>
      </form>
    </div>
  );
};

export default ResumeUploader;