import { Outlet } from 'react-router-dom';
import { useAuthRestore } from '../hooks/useAuthRestore';

const RootLayout = () => {
  useAuthRestore();

  return (
    <div className="app-container">
      <Outlet />
    </div>
  );
};

export default RootLayout;