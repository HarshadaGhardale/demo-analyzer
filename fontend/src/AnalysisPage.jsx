import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const AnalysisPage = () => {
  const { state } = useLocation();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          clearInterval(interval);
          return 100;
        }
        return old + 5;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Remove asterisks and clean up feedback text if backend didn't already do it
  const cleanSuggestions = Array.isArray(state?.suggestions)
    ? state.suggestions
    : state?.suggestions
        ?.replace(/\*\*/g, "") // remove bold markdown
        ?.replace(/\*/g, "")   // remove any remaining *
        ?.split(/\d+\.\s/)     // split into points if backend returned a string
        ?.filter((s) => s.trim() !== "");

  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        background: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          maxWidth: "800px",
          margin: "auto",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ color: "#333", marginBottom: "20px" }}>
          Analyzing your resume...
        </h2>
        <div
          style={{
            width: "100%",
            height: "20px",
            margin: "20px 0",
            background: "#e5e7eb",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
              transition: "width 0.3s",
            }}
          />
        </div>

        {progress >= 100 && (
          <>
            <h3 style={{ marginTop: "30px", color: "#111827" }}>Feedback</h3>
            <div
              style={{
                background: "#f3f4f6",
                padding: "20px",
                borderRadius: "8px",
                textAlign: "left",
                marginTop: "10px",
              }}
            >
              {Array.isArray(cleanSuggestions) && cleanSuggestions.length > 0 ? (
                <ul style={{ paddingLeft: "20px", lineHeight: "1.8", color: "#374151" }}>
                  {cleanSuggestions.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "#374151" }}>
                  {state?.suggestions || "No feedback available."}
                </p>
              )}
            </div>
            <a
              href={`http://localhost:5000${state?.downloadLink}`}
              download
              style={{
                display: "inline-block",
                marginTop: "30px",
                padding: "12px 30px",
                background: "linear-gradient(90deg, #2563eb, #1d4ed8)",
                color: "#fff",
                fontWeight: "bold",
                textDecoration: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                transition: "transform 0.2s ease-in-out",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Get AI Improved Version
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;