import React, { useState, useEffect } from "react";
import formSchema from "../data/formSchema";
import UniversalField from "./UniversalField";

function Section4Form({ onNext, updateFormData, existingData }) {
  const section = formSchema["Section 4"];
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (existingData) {
      setFormData(existingData);
    }
  }, [existingData]);

  function handleChange(event, key) {
    const value =
      event.target.type === "file" ? event.target.files[0] : event.target.value;
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    updateFormData("section4", formData);
    onNext();
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "auto", padding: "32px" }}>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "12px",
          padding: "32px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        }}
      >
        <h3
          style={{
            marginBottom: "12px",
            fontSize: "22px",
            fontWeight: "600",
            color: "#003366",
          }}
        >
          Section 4 – {section.title || section.section}
        </h3>

        {section.description && (
          <p
            style={{
              marginBottom: "24px",
              fontSize: "15px",
              color: "#555",
              whiteSpace: "pre-line",
            }}
          >
            {section.description}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {section.fields.map((field, idx) => (
            <div key={idx} style={{ marginBottom: "32px" }}>
              <label
                style={{
                  fontWeight: "600",
                  display: "block",
                  marginBottom: "10px",
                  fontSize: "16px",
                  color: "#222",
                }}
              >
                {field.label}{" "}
                {(field.required || section.required) && (
                  <span style={{ color: "red" }}>*</span>
                )}
              </label>

              <div style={{ minWidth: "220px", maxWidth: "100%" }}>
                <UniversalField
                  field={field}
                  formData={formData}
                  onChange={(e) => handleChange(e, field.key)}
                  parentKey={field.key}
                  value={formData[field.key] || ""}
                />
              </div>
            </div>
          ))}

          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <button
              type="submit"
              onClick={onNext}
              style={{
                padding: "12px 28px",
                backgroundColor: "#004080",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "background 0.3s",
              }}
              onMouseOver={(e) =>
                (e.target.style.backgroundColor = "rgb(10, 83, 156)")
              }
              onMouseOut={(e) =>
                (e.target.style.backgroundColor = "#004080")
              }
            >
              Next Section
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Section4Form;