// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EditNomination from './pages/EditNomination';
import Login from './pages/Login';
import Register from './pages/Register';
import ViewNomination from './pages/ViewNomination';
import MultiSectionForm from './pages/MultiSectionForm';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute element={Dashboard} />} />

      <Route path="/form" element={<MultiSectionForm />} />
      <Route path="/edit/:id" element={<EditNomination />} />
      <Route path="/view/:id" element={<ViewNomination />} />
    </Routes>
  );
};

export default App;