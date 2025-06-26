import React, { useState, useEffect } from "react";
import formSchema from "../data/formSchema";
import UniversalField from "./UniversalField";

function Section1Form({ onNext, updateFormData, existingData }) {
  const section = formSchema["Section 1"];
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (existingData) {
      setFormData(existingData);
    }
  }, [existingData]);

  function handleChange(event, key) {
    setFormData((prev) => ({ ...prev, [key]: event.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    updateFormData("section1", formData);
    onNext();
  }

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "32px" }}>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "12px",
          padding: "32px",
          backgroundColor: "#fdfdfd",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
        }}
      >
        <h3 style={{ marginBottom: "4px", fontSize: "22px", fontWeight: "600", color: "#003366" }}>
          Section 1 – {section.section}
        </h3>
        <p style={{ marginBottom: "24px", fontSize: "15px", color: "#666" }}>
          {section.description}
        </p>

        <form onSubmit={handleSubmit}>
          {section.fields.map((field) => (
            <div key={field.key} style={{ marginBottom: "24px" }}>
              {field.label && (
                <label
                  style={{
                    fontWeight: "500",
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    color: "#222",
                  }}
                >
                  {field.label} {field.required && <span style={{ color: "#d00" }}>*</span>}
                </label>
              )}
              <UniversalField
                field={field}
                formData={formData}
                onChange={handleChange}
              />
            </div>
          ))}

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <button
              type="submit"
              onClick={onNext}
              style={{
                padding: "12px 30px",
                backgroundColor: "#004080",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "background 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#0a539c")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#004080")}
            >
              Next Section
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Section1Form;