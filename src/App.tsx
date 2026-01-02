import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import AuthComponent from './components/AuthComponent';
import DashboardComponent from './components/DashboardComponent';
import RequireAuth from './components/RequireAuth';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthComponent />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardComponent />
          </RequireAuth>
        }
      />
    </Routes>
  );
};

export default App;
