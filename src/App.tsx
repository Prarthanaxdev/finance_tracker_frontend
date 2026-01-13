import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import RequireAuth from './components/Auth/RequireAuth';
import AppInitializer from './AppInitializer';
import './App.css';

const AuthComponent = lazy(() => import('./components/Auth/AuthComponent'));
const DashboardComponent = lazy(() => import('./components/Dashboard/Dashboard'));

const App = () => {
  return (
    <>
      <AppInitializer />
      <Suspense fallback={<div>Loading...</div>}>
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
      </Suspense>
    </>
  );
};

export default App;
