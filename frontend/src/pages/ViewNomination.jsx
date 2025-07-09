import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ViewNomination() {
  const { id } = useParams();
  const [nomination, setNomination] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    axios.get(`http://localhost:5001/api/nominations/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => setNomination(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to fetch nomination data");
        navigate(-1);
      });
  }, [id, navigate]);

  if (!nomination) return <p style={{ padding: 40 }}>Loading...</p>;

  const renderSection = (section, index) => (
    <div key={index} style={{ marginBottom: '30px', width: '100%' }}>
      <h2 style={{ fontSize: '20px', marginBottom: '10px', color: '#004080' }}>Section {index + 1}</h2>
      <div style={{ paddingLeft: '20px' }}>
        {Object.entries(section).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '8px' }}>
            <strong style={{ textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}:</strong> {String(value)}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
      padding: '40px',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{ maxWidth: '900px', width: '100%' }}>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: '24px',
            backgroundColor: '#004080',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          ⬅ Back to Dashboard
        </button>

        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#004080', marginBottom: '24px' }}>
          Nomination Details
        </h1>

        {[1, 2, 3, 4, 5].map((i) =>
          nomination[`section${i}`] && renderSection(nomination[`section${i}`], i - 1)
        )}
      </div>
    </div>
  );
}

export default ViewNomination;