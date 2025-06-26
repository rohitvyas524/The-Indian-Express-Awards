import React from "react";

function UniversalField({ field, formData, onChange, parentKey = "", groupRequired = false }) {
  
  // const fullKey = parentKey ? `${parentKey}_${field.key}` : field.key;
  const fullKey = parentKey ? `${parentKey}` : field.key;
  const required = field.required ?? groupRequired;

  const handleChange = (e) => {
    const { type, checked, value, files } = e.target;
    const newValue =
      type === "checkbox" ? checked :
        type === "file" ? files[0] :
          value;
    onChange({ target: { value: newValue } }, fullKey);
  };

  const handleMultiCheckboxChange = (e, option) => {
    const checked = e.target.checked;
    const prev = formData[fullKey] || [];
    const updated = checked
      ? [...prev, option]
      : prev.filter((item) => item !== option);
    onChange({ target: { value: updated } }, fullKey);
  };

  const handleOtherTextChange = (e) => {
    onChange({ target: { value: e.target.value } }, `${fullKey}_other`);
  };
  
  

  const commonProps = {
    required: {required},
    readOnly: field.readOnly,
    min: field.min,
    max: field.max,
    value: field.type !== "file" ? formData[fullKey] || "" : undefined,
    onChange: handleChange,
    name: fullKey,
    style: { width: "100%", padding: "8px", marginTop: "4px" },
  };

  if (field.type === "group") {
    return (
      <div style={{ marginBottom: "16px" }}>
        <strong>{field.label}</strong>
        {field.fields.map((subField, idx) => (
          <UniversalField
            key={idx}
            field={subField}
            formData={formData}
            onChange={onChange}
             name={fullKey}
            parentKey={fullKey}
            groupRequired={field.required}
          />
        ))}
      </div>
    );
  }

  

  switch (field.type) {
    case "select":
      const selectedValue = formData[fullKey];
      const isOtherSelected = selectedValue?.toLowerCase().includes("other");
      return (
        <div>
          <select {...commonProps}>
            <option value="">--Select--</option>
            {field.options.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
          {isOtherSelected && (
            <input
              type="text"
              placeholder="Explain"
              value={formData[`${fullKey}_other`] || ""}
              name={fullKey}
              onChange={handleOtherTextChange}
              style={{ width: "100%", padding: "8px", marginTop: "8px" }}
            />
          )}
        </div>
      );

    case "textarea":
      return <textarea rows={6} {...commonProps} />;

    case "checkbox":
      return (
        <label style={{ display: "block", marginTop: "8px" }}>
          <input
            type="checkbox"
             name={fullKey}
            checked={formData[fullKey] || false}
            onChange={handleChange}
            style={{ marginRight: "8px" }}
          />
          {field.label || fullKey}
        </label>
      );

    case "multipleCheckbox":
      return (
        <div style={{ marginTop: "8px" }}>
          <strong>{field.label}</strong>
          {field.options.map((option, idx) => (
            <label key={idx} style={{ display: "block", marginTop: "4px" }}>
              <input
                type="checkbox"
                 name={fullKey}
                checked={(formData[fullKey] || []).includes(option)}
                onChange={(e) => handleMultiCheckboxChange(e, option)}
                style={{ marginRight: "8px" }}
              />
              {option}
            </label>
          ))}
        </div>
      );

    case "radio":
      return (
        <div style={{ marginTop: "8px" }}>
          {field.options.map((option, idx) => (
            <label key={idx} style={{ marginRight: "12px" }}>
              <input
                type="radio"
                name={fullKey}
                value={option}
                checked={formData[fullKey] === option}
                onChange={handleChange}
              />
              {option}
            </label>
            
          ))}
        </div>
      );

    case "file":
      return (
        <input
          type="file"
           name={fullKey}
          {...commonProps}
          onChange={handleChange}
          accept={field.filetype}
          style={{ marginTop: "8px" }}
        />
      );

    default:
      return <input type={field.type || "text"} {...commonProps} />;
  }
}

export default UniversalField;