import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  return user && user.token ? <Element /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;