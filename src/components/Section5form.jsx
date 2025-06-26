import React, { useState, useEffect } from "react";
import formSchema from "../data/formSchema";
import UniversalField from "./UniversalField";

function Section5Form({ onSubmitFinal, existingData }) {
  const section = formSchema["Section 5"];
  const [localData, setLocalData] = useState({});

  function handleChange(event, key) {
    const value =
      event.target.type === "file" ? event.target.files[0] : event.target.value;
    setLocalData((prev) => ({ ...prev, [key]: value }));
  }

  useEffect(() => {
    if (existingData) {
      setLocalData(existingData);
    } else {
      setLocalData({ ready_for_submission: "No, Keep in Draft" });
    }
  }, [existingData]);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmitFinal(localData);
    console.log("Section 5 data prepared for submission:", localData);
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
          Section 5 – {section.title || section.section}
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
            <div
              key={idx}
              style={{
                marginBottom: "24px",
              }}
            >
              {field.type !== "checkbox" && (
                <label
                  style={{
                    fontWeight: "600",
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "15px",
                    color: "#222",
                  }}
                >
                  {field.label}{" "}
                  {field.required && <span style={{ color: "red" }}>*</span>}
                </label>
              )}

              <div
                style={{
                  minWidth: "240px",
                  maxWidth: "100%",
                  borderRadius: "6px",
                }}
              >
                <UniversalField
                  field={field}
                  formData={localData}
                  onChange={(e) => handleChange(e, field.key)}
                  parentKey={field.key}
                  value={localData[field.key] || ""}
                />
              </div>
            </div>
          ))}

          <p
            style={{
              fontSize: "13px",
              color: "#666",
              marginTop: "16px",
              fontStyle: "italic",
            }}
          >
            <strong>Note:</strong> Files, if any, will be uploaded with Final
            Submission only.
          </p>

          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <button
              type="submit"
              style={{
                padding: "12px 28px",
                backgroundColor: "#004080",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.target.style.backgroundColor = "rgb(10, 83, 156)")
              }
              onMouseOut={(e) =>
                (e.target.style.backgroundColor = "#004080")
              }
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Section5Form;