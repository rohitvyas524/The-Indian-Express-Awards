// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import './index.css';
import Dashboard from './components/Dashboard';
import EditNomination from './components/EditNomination'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/form" element={<App />} />
      <Route path="/edit/:id" element={<EditNomination />} /> 

    </Routes>
  </BrowserRouter>
);