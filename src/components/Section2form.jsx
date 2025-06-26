import React, { useState, useEffect } from "react";
import formSchema from "../data/formSchema";
import UniversalField from "./UniversalField";

function Section2Form({ onNext, updateFormData, existingData }) {
  const section = formSchema["Section 2"];
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
    updateFormData("section2", formData);
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
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
        }}
      >
        <h3
          style={{
            marginBottom: "8px",
            fontSize: "24px",
            fontWeight: "600",
            color: "#003366",
          }}
        >
          Section 2 – {section.title}
        </h3>
        <p style={{ marginBottom: "6px", fontSize: "15px", color: "#444" }}>
          {section.description}
        </p>
        <p style={{ marginBottom: "24px", fontSize: "14px", color: "#666" }}>
          {section.descriptionline}
        </p>

        <form onSubmit={handleSubmit}>
          {section.fields.map((group, idx) => (
            <div key={idx} style={{ marginBottom: "48px" }}>
              <label
                style={{
                  fontWeight: "600",
                  display: "block",
                  marginBottom: "16px",
                  fontSize: "18px",
                  color: "#222",
                }}
              >
                {group.label}
              </label>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "30px",
                }}
              >
                {group.fields.map((subField, subIdx) => {
                  const fullKey = `${group.key}_${subField.key}`;
                  return (
                    <div
                      key={subIdx}
                      style={{
                        flex: "1 1 240px",
                        minWidth: "220px",
                        maxWidth: "calc(50% - 10px)",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          display: "block",
                          marginBottom: "6px",
                          color: "#333",
                        }}
                      >
                        {subField.label}
                        {(subField.required || group.required) && (
                          <span style={{ color: "red" }}> *</span>
                        )}
                      </label>
                      <UniversalField
                        field={subField}
                        formData={formData}
                        onChange={(e) => handleChange(e, fullKey)}
                        parentKey={fullKey}
                        value={formData[fullKey] || ""}
                      />
                    </div>
                  );
                })}
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
                (e.target.style.backgroundColor = "#0a53a0")
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

export default Section2Form;