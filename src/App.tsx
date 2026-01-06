import { Routes, Route } from 'react-router-dom';
import AuthComponent from './components/AuthComponent';
import DashboardComponent from './components/DashboardComponent';
import RequireAuth from './components/RequireAuth';
import AppInitializer from './AppInitializer';
import './App.css';

const App = () => {
  return (
    <>
      <AppInitializer />
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
    </>
  );
};

export default App;
