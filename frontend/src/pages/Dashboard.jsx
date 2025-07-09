import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

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
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Diagnostics");
  const modalRef = useRef();
  const user = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNominations = () => {
    const endpoint = user?.role === "admin"
      ? "http://localhost:5001/api/nominations/all"
      : "http://localhost:5001/api/nominations";

    const token = JSON.parse(localStorage.getItem("user"))?.token;

    axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
      .then(res => {
        const data = res.data;

        // 🟢 For admin: keep only submitted nominations
        const filtered = user?.role === "admin"
          ? data.filter(n => n.section5?.ready_for_submission !== "No, Keep in Draft")
          : data;

        setNominations(filtered);
      })
      .catch(err => console.error("Fetch error:", err));
  };
  useEffect(() => {
    if (user) fetchNominations();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    const token = JSON.parse(localStorage.getItem("user"))?.token;

    axios.delete(`http://localhost:5001/api/nominations/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
      .then(() => fetchNominations())
      .catch(err => {
        console.error("Delete error:", err);
        alert("Failed to delete nomination.");
      });
  };

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
      if (user?.role === "admin") {
        return n.category === filterStatus;
      } else {
        const isDraft = n.section5?.ready_for_submission === "No, Keep in Draft";
        return filterStatus === "Draft" ? isDraft : !isDraft;
      }
    });
  const selectedSubmittedRows = nominations.filter(n =>
    selectedRows.includes(n._id) &&
    n.section5?.ready_for_submission !== "No, Keep in Draft"
  );

  const totalAmount = selectedSubmittedRows.length * 25000;

  return (
    <div style={{ padding: '32px', fontFamily: 'Inter, sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header row */}
      <div style={{ position: 'relative', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{
          fontSize: "28px",
          fontWeight: "700",
          color: "#004080",
          textTransform: "uppercase",
          fontFamily: "Roboto, sans-serif",
          textAlign: "center",
          flex: 1
        }}>
          {user?.role === "admin" ? "Admin Panel" : "Nominee Dashboard"}
        </h2>

        {/* Dropdown */}
        <div style={{ position: 'relative', marginLeft: 'auto' }} ref={dropdownRef}>
          {/* Dropdown toggle button */}
          <div
            onClick={() => setShowDropdown(prev => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '24px',
              backgroundColor: '#004080',
              color: '#fff',
              fontWeight: 500,
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <span style={{ textTransform: 'capitalize' }}>{user?.name || user?.email}</span>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.586l3.71-4.355a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Dropdown content */}
          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '40px',
              right: 0,
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              zIndex: 1001
            }}>
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  navigate("/login");
                }}
                style={{
                  padding: '10px 16px',
                  width: '100%',
                  border: 'none',
                  background: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#333'
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
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
          {user?.role === "admin" ? (
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
              <option value="All">All Categories</option>
              {Object.keys(categories).map((categoryName) => (
                <option key={categoryName} value={categoryName}>
                  {categoryName}
                </option>
              ))}
            </select>
          ) : (
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
              <option value="All">⌥ All</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
            </select>
          )}
        </div>
        {user?.role !== "admin" && (
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
        )}
      </div>

      {/* Stats */}
      {user?.role === "admin" ? (
        <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
          <div style={cardStyle}>
            <h3>Total Forms</h3>
            <h2>{nominations.length}</h2>
          </div>
          <div style={cardStyle}>
            <h3>Total Users</h3>
            <h2>{new Set(nominations.map(n => n.userId?.name)).size}</h2>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
          <div style={cardStyle}>
            <h3>Total Nominations</h3>
            <h2>{nominations.length}</h2>
          </div>
          <div style={cardStyle}>
            <h3>Drafts</h3>
            <h2 style={{ color: 'red' }}>{draftCount}</h2>
          </div>
          <div style={cardStyle}>
            <h3>Submitted</h3>
            <h2 style={{ color: 'green' }}>{submittedCount}</h2>
          </div>
        </div>
      )}

      {/* Table */}
      <table style={{ width: '100%', backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
        <thead style={{ backgroundColor: '#f1f1f1' }}>
          <tr>
            {user?.role !== "admin" && <th style={thStyle}><input type="checkbox" checked={selectAll} onChange={handleSelectAll} /></th>}
            {user?.role === "admin" ? (
              <>
                <th style={thStyle}>Sr. No</th>
                <th style={thStyle}>User</th>
                <th style={thStyle}>Nomination Name</th>
                <th style={thStyle}>Nomination ID</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Submitted At</th>
                <th style={thStyle}>Actions</th>
              </>
            ) : (
              <>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Nomination Name</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredNominations.map((nom, index) => {
            const isDraft = nom.section5?.ready_for_submission === "No, Keep in Draft";
            const statusStyle = {
              backgroundColor: isDraft ? "#fef3e7" : "#e6f4ea",
              color: isDraft ? "#d47f17" : "#34a853",
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600'
            };

            return (
              <tr key={nom._id}>
                {user?.role !== "admin" && (
                  <td style={tdStyle}>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(nom._id)}
                      onChange={() => handleSelectRow(nom._id)}
                      disabled={isDraft}
                    />
                  </td>
                )}
                {user?.role === "admin" ? (
                  <>
                    <td style={tdStyle}>{index + 1}</td>
                    <td style={tdStyle}>{nom.userId?.name || 'N/A'}</td>
                    <td style={tdStyle}>{nom.section1?.participant_name || 'N/A'}</td>
                    <td style={tdStyle}>{nom._id}</td>
                    <td style={tdStyle}>{nom.category || 'N/A'}</td>
                    <td style={tdStyle}>{new Date(nom.updatedAt).toLocaleString()}</td>
                    <td style={tdStyle}>
                      <Link to={`/view/${nom._id}`} style={{
                        backgroundColor: '#10b981',
                        color: '#fff',
                        padding: '6px 14px',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        marginRight: '10px'
                      }}>
                        View
                      </Link>
                      <button onClick={() => handleDelete(nom._id)}
                        style={{
                          backgroundColor: '#ef4444',
                          color: '#fff',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={tdStyle}>{nom._id}</td>
                    <td style={tdStyle}>{nom.section1?.participant_name || 'N/A'}</td>
                    <td style={tdStyle}><span style={statusStyle}>{isDraft ? "Draft" : "Submitted"}</span></td>
                    <td style={tdStyle}>
                      <Link to={`/edit/${nom._id}`} style={{
                        backgroundColor: '#2563eb',
                        color: '#fff',
                        padding: '6px 14px',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        marginRight: '10px'
                      }}>
                        <Pencil size={16} /> Edit
                      </Link>
                      <button onClick={() => handleDelete(nom._id)} style={{
                        backgroundColor: '#ef4444',
                        color: '#fff',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </>
                )}
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

      {/* Modal */}
      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div ref={modalRef} style={{
            backgroundColor: "#fff",
            padding: "30px",
            borderRadius: "12px",
            width: "90%", maxWidth: "900px"
          }}>
            <h2 style={{ textAlign: "center", color: "#004080" }}>Select Nomination Category</h2>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "12px", marginTop: "24px" }}>
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

            <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
              {categories[activeTab].map((item, index) => (
                <div key={index} style={{
                  backgroundColor: "#f4f6fa",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  border: "1px solid #ddd"
                }}>
                  <h4 style={{ marginBottom: "12px", color: "#004080" }}>{item.title}</h4>
                  <button onClick={() => handleNominate(item.title)} disabled={item.disabled}
                    style={{
                      backgroundColor: item.disabled ? "#ccc" : "#004080",
                      color: "#fff",
                      padding: "8px 16px",
                      border: "none",
                      borderRadius: "6px",
                      cursor: item.disabled ? "not-allowed" : "pointer"
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
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px"
              }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const cardStyle = {
  flex: 1,
  background: '#fff',
  padding: '24px 16px',
  borderRadius: '12px',
  textAlign: 'center',
  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  border: '1px solid #e5e7eb'
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