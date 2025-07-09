import React, { useState } from "react";
import Section1form from './Section1form';
import Section2Form from "./Section2form";
import Section3form from "./Section3form";
import Section4Form from "./Section4form";
import Section5Form from "./Section5form";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import formSchema from "../data/formSchema";

const MultiSectionForm = () => {
  const location = useLocation();
  const category = location.state?.category;
  const title = location.state?.title;
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const handleNext = () => {
    const sectionKey = `section${currentSection}`;
    const schemaKey = `Section ${currentSection}`;
    const schema = formSchema[schemaKey];
    const formElements = document.querySelectorAll("form input, form select, form textarea");

    const data = {};
    const validationErrors = [];

    formElements.forEach((input) => {
      const key = input.getAttribute("name");
      if (!key) return;

      let value;
      if (input.type === "checkbox") {
        value = input.checked;
      } else if (input.type === "file") {
        value = input.files[0];
      } else {
        value = input.value?.trim();
      }

      let isValid = true;

      if (value) {
        // Find field schema
        const findField = (key) => {
          for (let field of schema.fields) {
            if (field.type === "group") {
              const match = field.fields.find(sf => `${field.key}_${sf.key}` === key);
              if (match) return { ...match, required: match.required ?? field.required };
            } else if (field.key === key) {
              return field;
            }
          }
          return null;
        };

        const field = findField(key);
        if (!field) return;

        if (field.type === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            isValid = false;
            validationErrors.push(`${key} must be a valid email`);
          }
        }

        if (field.type === "url") {
          try {
            new URL(value);
          } catch {
            isValid = false;
            validationErrors.push(`${key} must be a valid URL`);
          }
        }

        if (field.type === "number") {
          const parsed = Number(value);
          if (value === "" || isNaN(parsed)) {
            isValid = false;
            validationErrors.push(`${key} must be a number`);
          }
        }
      }

      data[key] = isValid ? value : ""; // Clear invalid field if needed
    });

    if (validationErrors.length > 0) {
      alert("⚠️ Please fix the following issues:\n\n" + validationErrors.join("\n"));
      return; // stay on current section
    }

    updateFormData(sectionKey, data);
    setCurrentSection((prev) => Math.min(prev + 1, 5));
  };

  const updateFormData = (sectionKey, sectionData) => {
    setFormData(prev => ({
      ...prev,
      [sectionKey]: sectionData
    }));
  };

  const handleAutoSave = () => {
    const sectionKey = `section${currentSection}`;
    const currentSectionData = document.querySelectorAll("form input, form select, form textarea");
    const data = {};
    currentSectionData.forEach(input => {
      const key = input.getAttribute("name");
      if (!key) return;
      if (input.type === "checkbox") {
        data[key] = input.checked;
      } else if (input.type === "file") {
        data[key] = input.files[0];
      } else {
        data[key] = input.value;
      }
    });
    updateFormData(sectionKey, data);
  };

  const checkSectionComplete = (sectionNum) => {
    const sectionKey = `section${sectionNum}`;
    const schemaKey = `Section ${sectionNum}`;
    const sectionData = formData[sectionKey] || {};
    const schema = formSchema[schemaKey];

    if (!schema || !Array.isArray(schema.fields)) return false;

    let hasAtLeastOneFieldFilled = false;

    for (const field of schema.fields) {
      if (field.type === "group" && Array.isArray(field.fields)) {
        for (const subField of field.fields) {
          const fullKey = `${field.key}_${subField.key}`;
          const isRequired = subField.required ?? field.required;
          const val = sectionData[fullKey];

          if (val !== undefined && val !== "") {
            hasAtLeastOneFieldFilled = true;
          }

          if (isRequired && (val === undefined || val === "")) {
            return false; // Required field missing
          }
        }
      } else {
        const val = sectionData[field.key];

        if (val !== undefined && val !== "") {
          hasAtLeastOneFieldFilled = true;
        }

        if (field.required && (val === undefined || val === "")) {
          return false; // Required field missing
        }
      }
    }

    return hasAtLeastOneFieldFilled;
  };

  const handleFinalSubmit = (section5Data) => {
    const finalDataToSend = {
      ...formData,
      section5: section5Data,
      category,
      title,
    };

    const isFinal = section5Data.ready_for_submission === "Yes, Final Submission";

    if (isFinal) {
      const missing = [];

      for (let i = 1; i <= 4; i++) {
        const sectionKey = `Section ${i}`;
        const sectionId = `section${i}`;
        const schema = formSchema[sectionKey];
        const data = finalDataToSend[sectionId] || {};

        if (!data || Object.keys(data).length === 0) {
          missing.push(`${sectionKey} - Entire section empty`);
          continue;
        }

        for (const field of schema.fields) {
          if (field.type === "group") {
            const groupRequired = field.required;
            for (const subField of field.fields) {
              const fullKey = `${field.key}_${subField.key}`;
              const isRequired = subField.required ?? groupRequired;
              const value = data[fullKey];
              if (isRequired && (value === undefined || value === "")) {
                missing.push(`${sectionKey} → ${subField.label}`);
              }
            }
          } else {
            const value = data[field.key];
            if (field.required && (value === undefined || value === "")) {
              missing.push(`${sectionKey} → ${field.label}`);
            }
          }
        }
      }

      const section5Schema = formSchema["Section 5"];
      for (const field of section5Schema.fields) {
        const val = section5Data[field.key];
        if (field.required && (val === undefined || val === "" || val === false)) {
          missing.push(`Section 5 → ${field.label}`);
        }
      }

      if (missing.length > 0) {
        alert(`❌ Final submission blocked. Please complete all required fields:\n\n- ${missing.join("\n- ")}`);
        return;
      }
    }
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("Token:", user?.token);
    axios.post("http://localhost:5001/api/nominations", finalDataToSend, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,  // ✅ token correctly passed here
      },
    })
      .then(() => {
        alert(isFinal ? "✅ Final submission successful!" : "Nomination saved");
        navigate("/");
      })
      .catch((err) => {
        console.error("❌ Submit error:", err);
        alert("Submission failed.");
      });
  };

  return (
    <div style={{ backgroundColor: "rgb(249, 250, 251)", position: "relative" }}>

      {/* Top-left Back Button */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          backgroundColor: "#004080",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "8px 16px",
          fontSize: "14px",
          fontWeight: "500",
          fontFamily: "Roboto, sans-serif",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#003366";
          e.target.style.transform = "scale(1.03)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#004080";
          e.target.style.transform = "scale(1)";
        }}
      >
        ← Back to Dashboard
      </button>

      {/* Centered Heading */}
      <div style={{ padding: "32px 0 16px", textAlign: "center" }}>
        <h2 style={{
          fontSize: "26px",
          fontWeight: "700",
          color: "#004080",
          margin: "0",
          textTransform: "uppercase",
          fontFamily: "Roboto, sans-serif",
          letterSpacing: "0.5px",
        }}>
          {title}
        </h2>
        <div style={{
          fontSize: "22px",
          fontWeight: "600",
          color: "#004080",
          marginTop: "6px",
          textTransform: "uppercase",
          fontFamily: "Roboto, sans-serif",
        }}>
          Nomination Form
        </div>
      </div>

      {/* Step Navigation */}
      <div style={{
        position: "relative",
        display: "flex",
        justifyContent: "space-between",
        gap: "8px",
        margin: "0 auto 10px",
        maxWidth: "820px",
      }}>
        <div style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          right: "16px",
          height: "2px",
          backgroundColor: "darkblue",
          zIndex: 0,
        }}></div>

        {[
          "PARTICIPANT INFORMATION",
          "OPERATIONAL MATRIX",
          "CASE STUDY",
          "SUPPORTING DOCUMENTS",
          "DECLARATION",
        ].map((label, index) => {
          const sectionNum = index + 1;
          const isActive = currentSection === sectionNum;
          const isComplete = checkSectionComplete(sectionNum);

          return (
            <div
              key={index}
              onClick={() => {
                handleAutoSave();
                setCurrentSection(sectionNum);
              }}
              style={{
                textAlign: "center",
                cursor: "pointer",
                flex: 1,
                zIndex: 1,
              }}
            >
              <div style={{
                margin: "0 auto 8px",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: isComplete ? "#28a745" : (isActive ? "#004080" : "#ff0000"),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "16px",
                transition: "all 0.3s ease",
              }}>
                {isComplete ? "✓" : sectionNum}
              </div>
              <div style={{
                fontSize: "11px",
                fontWeight: isActive ? "600" : "500",
                color: isComplete ? "#28a745" : (isActive ? "#004080" : "#333"),
                transition: "color 0.3s",
                maxWidth: "100px",
                margin: "0 auto",
                lineHeight: "1.2",
              }}>
                {label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Section Forms */}
      {currentSection === 1 && <Section1form onNext={handleNext} updateFormData={updateFormData} existingData={formData.section1} />}
      {currentSection === 2 && <Section2Form onNext={handleNext} updateFormData={updateFormData} existingData={formData.section2} />}
      {currentSection === 3 && <Section3form onNext={handleNext} updateFormData={updateFormData} existingData={formData.section3} />}
      {currentSection === 4 && <Section4Form onNext={handleNext} updateFormData={updateFormData} existingData={formData.section4} />}
      {currentSection === 5 && <Section5Form existingData={formData.section5} onSubmitFinal={handleFinalSubmit} />}
    </div>
  );
};

export default MultiSectionForm;