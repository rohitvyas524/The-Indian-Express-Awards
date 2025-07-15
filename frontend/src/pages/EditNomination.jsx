import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Section1form from './Section1form';
import Section2Form from "./Section2form";
import Section3form from "./Section3form";
import Section4Form from "./Section4form";
import Section5Form from "./Section5form";
import formSchema from "../data/formSchema";

const EditNominationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    if (!token) return;

    axios.get(`http://localhost:5001/api/nominations/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
      .then(res => setFormData(res.data))
      .catch(err => {
        console.error("Error loading nomination:", err);
        alert("Failed to fetch nomination");
      });
  }, [id]);
  const handleNext = () => {
    const sectionKey = `Section ${currentSection}`;
    const schema = formSchema[sectionKey];
    const formElements = document.querySelectorAll("form input, form select, form textarea");

    const data = {};
    const validationWarnings = [];

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

      if (value) {
        const findField = (key) => {
          for (let f of schema.fields) {
            if (f.type === "group") {
              const match = f.fields.find(sf => `${f.key}_${sf.key}` === key);
              if (match) return { ...match, required: match.required ?? f.required };
            } else if (f.key === key) {
              return f;
            }
          }
          return null;
        };

        const field = findField(key);
        if (!field) return;

        let isValid = true;

        if (field.type === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            validationWarnings.push(`${key} must be a valid email`);
            isValid = false;
          }
        }

        if (field.type === "url") {
          try {
            new URL(value);
          } catch {
            validationWarnings.push(`${key} must be a valid URL`);
            isValid = false;
          }
        }

        if (field.type === "number" && isNaN(Number(value))) {
          validationWarnings.push(`${key} must be a number`);
          isValid = false;
        }

        data[key] = isValid ? value : "";
      } else {
        data[key] = value;
      }
    });

    updateFormData(`section${currentSection}`, data);

    if (validationWarnings.length > 0) {
      alert("⚠️ Please fix the following issues:\n\n" + validationWarnings.join("\n"));
      return; 
    }

    setCurrentSection((prev) => Math.min(prev + 1, 5));
  };

  const updateFormData = (sectionKeyOrData, maybeData) => {
    if (typeof sectionKeyOrData === 'string' && typeof maybeData === 'object') {
      const sectionKey = sectionKeyOrData;
      setFormData(prev => ({
        ...prev,
        [sectionKey]: maybeData
      }));
    } else if (typeof sectionKeyOrData === 'object') {
      const sectionKey = `section${currentSection}`;
      setFormData(prev => ({
        ...prev,
        [sectionKey]: sectionKeyOrData
      }));
    }
  };

  const saveCurrentSectionData = () => {
    const sectionKey = `section${currentSection}`;
    const formElements = document.querySelectorAll("form input, form select, form textarea");

    const data = {};
    formElements.forEach((input) => {
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

  const handleUpdate = () => {
    const sectionKey = `section${currentSection}`;
    const formElements = document.querySelectorAll("form input, form select, form textarea");

    const data = {};
    formElements.forEach((input) => {
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

    const updatedForm = {
      ...formData,
      [sectionKey]: data
    };

    const latestSection5 = sectionKey === "section5" ? data : updatedForm.section5;
    const isFinal = latestSection5?.ready_for_submission === "Yes, Final Submission";

    if (isFinal) {
      const isValid = () => {
        for (let i = 1; i <= 4; i++) {
          const sKey = `Section ${i}`;
          const sId = `section${i}`;
          const schema = formSchema[sKey];
          const sData = updatedForm[sId] || {};

          for (const field of schema.fields) {
            if (field.type === "group" && field.fields) {
              for (const subField of field.fields) {
                const fullKey = `${field.key}_${subField.key}`;
                const isRequired = subField.required ?? field.required;
                if (isRequired && !sData[fullKey]) return false;
              }
            } else {
              if (field.required && !sData[field.key]) return false;
            }
          }
        }
        return true;
      };

      if (!isValid()) {
        alert("❌ Final submission blocked. Please fill all required fields in Sections 1–4.");
        return;
      }
    }

    const token = JSON.parse(localStorage.getItem("user"))?.token;

    axios.put(`http://localhost:5001/api/nominations/${id}`, updatedForm, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
      .then(() => {
        alert(isFinal ? "✅ Final submission saved!" : "Draft saved successfully.");
        navigate("/");
      })
      .catch((err) => {
        console.error("Update error:", err);
        alert("Error saving nomination.");
      });
  };

  if (!formData) return <div>Loading form data...</div>;

  return (
    <div style={{ backgroundColor: "rgb(249, 250, 251)", position: "relative" }}>
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

      <h2 style={{
        textAlign: "center",
        paddingTop: "32px",
        paddingBottom: "12px",
        color: "#004080",
        fontWeight: "700",
        fontSize: "26px",
        fontFamily: "Roboto, sans-serif",
        textTransform: "uppercase"
      }}>
        Edit Nomination
      </h2>

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

        {["PARTICIPANT INFORMATION", "OPERATIONAL MATRIX", "CASE STUDY", "SUPPORTING DOCUMENTS", "DECLARATION"].map((label, index) => {
          const sectionIndex = index + 1;
          const sectionKey = `section${sectionIndex}`;
          const sectionSchema = formSchema[`Section ${sectionIndex}`];
          const sectionData = formData?.[sectionKey] || {};
          const isActive = currentSection === sectionIndex;
          const hasVisited = formData?.[sectionKey] !== undefined;

          let isValid = false;

          if (sectionSchema && Array.isArray(sectionSchema.fields)) {
            isValid = sectionSchema.fields.every((field) => {
              if (field.type === "group" && field.fields) {
                return field.fields.every((subField) => {
                  const fullKey = `${field.key}_${subField.key}`;
                  const required = subField.required ?? field.required;
                  return !required || !!sectionData[fullKey];
                });
              } else {
                return !field.required || !!sectionData[field.key];
              }
            });
          }

          let circleColor = "#dc3545"; //red
          let circleContent = sectionIndex;

          if (isActive) {
            circleColor = "#004080"; // blue
          } else if (isValid && hasVisited) {
            circleColor = "#28a745"; // green
            circleContent = "✓";
          }

          return (
            <div
              key={index}
              onClick={() => {
                saveCurrentSectionData();
                setCurrentSection(sectionIndex);
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
                backgroundColor: circleColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "14px",
                transition: "all 0.3s ease",
              }}>
                {circleContent}
              </div>
              <div style={{
                fontSize: "11px",
                fontWeight: isActive ? "600" : "500",
                color: circleColor,
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

      {currentSection === 1 && <Section1form onNext={handleNext} updateFormData={updateFormData} existingData={formData.section1} />}
      {currentSection === 2 && <Section2Form onNext={handleNext} updateFormData={updateFormData} existingData={formData.section2} />}
      {currentSection === 3 && <Section3form onNext={handleNext} updateFormData={updateFormData} existingData={formData.section3} />}
      {currentSection === 4 && <Section4Form onNext={handleNext} updateFormData={updateFormData} existingData={formData.section4} />}
      {currentSection === 5 && <Section5Form onSubmitFinal={handleUpdate} updateFormData={updateFormData} existingData={formData.section5} />}
    </div>
  );
};

export default EditNominationForm;