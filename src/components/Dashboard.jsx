import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';

const categories = {
  "Hospitals & Clinics": [{ title: "Excellence in Cardiac Care", disabled: false }],
  "Practitioners": [{ title: "Specialist of the year - Cardiology", disabled: false }],
  "Diagnostics": [{ title: "Diagnostic Chain of the Year", disabled: false }],
  "Health Tech & Innovation": [{ title: "Health Tech Startup of the Year", disabled: false }],
  "Healthcare Leadership": [{ title: "Healthcare Leader of the Year", disabled: false }],
  "Special Recognition": [{ title: "Social Impact in Healthcare", disabled: false }]
};

function Dashboard() {
  const [nominations, setNominations] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Diagnostics");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();
  const modalRef = useRef();

  useEffect(() => {
    axios.get('http://localhost:5001/api/nominations', { withCredentials: true })
      .then(res => setNominations(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNominate = (title) => {
    setShowModal(false);
    navigate("/form", { state: { category: activeTab, title } });
  };

  const handleSelectRow = (id) => {
    const nom = nominations.find(n => n._id === id);
    const isDraft = nom.section5?.ready_for_submission === "No, Keep in Draft";
    if (isDraft) return;
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      const submittedIds = filteredNominations
        .filter(n => n.section5?.ready_for_submission !== "No, Keep in Draft")
        .map(n => n._id);
      setSelectedRows(submittedIds);
    }
    setSelectAll(!selectAll);
  };

  const draftCount = nominations.filter(n => n.section5?.ready_for_submission === "No, Keep in Draft").length;
  const submittedCount = nominations.length - draftCount;

  const filteredNominations = nominations
    .filter(n => {
      const name = n.section1?.participant_name?.toLowerCase() || "";
      return (
        n._id.includes(searchQuery.toLowerCase()) ||
        name.includes(searchQuery.toLowerCase())
      );
    })
    .filter(n => {
      if (filterStatus === "All") return true;
      const isDraft = n.section5?.ready_for_submission === "No, Keep in Draft";
      return filterStatus === "Draft" ? isDraft : !isDraft;
    });

  const selectedSubmittedRows = nominations.filter(n =>
    selectedRows.includes(n._id) &&
    n.section5?.ready_for_submission !== "No, Keep in Draft"
  );

  const totalAmount = selectedSubmittedRows.length * 25000;

  return (
    <div style={{ padding: '32px', fontFamily: 'Inter, sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{
          fontSize: "28px",
          fontWeight: "700",
          color: "#004080",
          textTransform: "uppercase",
          fontFamily: "Roboto, sans-serif"
        }}>
          Nominee Dashboard
        </h2>
      </div>

      {/* Search & Add */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="🔍 Search nomination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              fontSize: '14px',
              width: '220px'
            }}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              fontSize: '14px',
              width: '220px'
            }}
          >
            <option value="All">⌥ Filter</option>
            <option value="Draft">Draft</option>
            <option value="Submitted">Submitted</option>
          </select>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          backgroundColor: '#004080',
          color: '#fff',
          padding: '10px 16px',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          cursor: 'pointer'
        }}>
          + Add new nomination
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
        <div  style={{ ...cardStyle, ...hoverCard }}> <h3>Total Nominations</h3><h2>{nominations.length}</h2> </div>
        <div style={{ ...cardStyle, ...hoverCard }}> <h3>Drafts</h3><h2 style={{ color: 'red' }}>{draftCount}</h2> </div>
        <div style={{ ...cardStyle, ...hoverCard }}> <h3>Submitted</h3><h2 style={{ color: 'green' }}>{submittedCount}</h2> </div>
      </div>

      {/* Table */}
      <table style={{ width: '100%', backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.1)', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f1f1f1' }}>
          <tr>
            <th style={thStyle}><input type="checkbox" checked={selectAll} onChange={handleSelectAll} /></th>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Nomination Name</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredNominations.map((nom) => {
            const isDraft = nom.section5?.ready_for_submission === "No, Keep in Draft";
            const statusLabel = isDraft ? "Draft" : "Submitted";
            const statusStyle = {
              backgroundColor: isDraft ? "#fef3e7" : "#e6f4ea",
              color: isDraft ? "#d47f17" : "#34a853",
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              display: 'inline-block'
            };

            return (
              <tr key={nom._id} style={{ borderBottom: '1px solid #eee', transition: 'background 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f9fafb"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "#fff"}>
                <td style={tdStyle}>
                  <input type="checkbox" checked={selectedRows.includes(nom._id)} onChange={() => handleSelectRow(nom._id)} disabled={isDraft} />
                </td>
                <td style={tdStyle}>{nom._id}</td>
                <td style={tdStyle}>{nom.section1?.participant_name || 'N/A'}</td>
                <td style={tdStyle}><span style={statusStyle}>{statusLabel}</span></td>
                <td style={tdStyle}>
                  <Link to={`/edit/${nom._id}`} style={{
                    backgroundColor: '#2563eb',
                    color: '#fff',
                    padding: '6px 14px',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Pencil size={16} /> Edit
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Proceed */}
      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <button
          disabled={selectedSubmittedRows.length === 0}
          style={{
            backgroundColor: selectedSubmittedRows.length === 0 ? '#e5e7eb' : '#2563eb',
            color: selectedSubmittedRows.length === 0 ? '#9ca3af' : '#fff',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: selectedSubmittedRows.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          Proceed to Pay INR {totalAmount.toLocaleString()}
        </button>
        <p style={{ fontSize: '14px', marginTop: '8px', color: 'gray' }}>
          Only submitted nominations can be selected for payment.
        </p>
      </div>

      {/* Modal (unchanged) */}
      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div ref={modalRef} style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "30px",
            width: "90%",
            maxWidth: "900px",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 8px 20px rgba(0,0,0,0.2)"
          }}>
            <h2 style={{ textAlign: "center", color: "#004080", marginBottom: "20px" }}>Select Nomination Category</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginBottom: "24px" }}>
              {Object.keys(categories).map((cat) => (
                <button key={cat} onClick={() => setActiveTab(cat)}
                  style={{
                    padding: "8px 14px",
                    backgroundColor: activeTab === cat ? "#004080" : "#eee",
                    color: activeTab === cat ? "#fff" : "#333",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "500"
                  }}>{cat}</button>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
              {categories[activeTab].map((item, index) => (
                <div key={index} style={{
                  backgroundColor: "#f4f6fa",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  border: "1px solid #ddd"
                }}>
                  <h4 style={{ marginBottom: "12px", color: "#004080", fontWeight: "600" }}>{item.title}</h4>
                  <button onClick={() => handleNominate(item.title)} disabled={item.disabled}
                    style={{
                      backgroundColor: item.disabled ? "#ccc" : "#004080",
                      color: "#fff",
                      padding: "8px 16px",
                      border: "none",
                      borderRadius: "6px",
                      cursor: item.disabled ? "not-allowed" : "pointer",
                      fontWeight: "500"
                    }}>
                    Nominate
                  </button>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "28px" }}>
              <button onClick={() => setShowModal(false)} style={{
                padding: "10px 20px",
                backgroundColor: "#004080",
                border: "none",
                color: "#fff",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500"
              }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const cardStyle = {
  flex: 1,
  background: '#fff',
  padding: '24px 16px',
  borderRadius: '12px',
  textAlign: 'center',
  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  border: '1px solid #e5e7eb',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
};

const hoverCard = {
  // cursor: 'pointer',
  ':hover': {
    transform: 'scale(1.03)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
  }
};

const thStyle = {
  padding: '12px',
  textAlign: 'left',
  fontWeight: '600'
};

const tdStyle = {
  padding: '12px'
};

export default Dashboard;
