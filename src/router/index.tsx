import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import RootLayout from './RootLayout';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { dashboardLoader, authAction } from './loaders';

// Lazy load components
const AuthComponent = lazy(() => import('../components/Auth/AuthComponent'));
const DashboardComponent = lazy(() => import('../components/Dashboard/Dashboard'));

// Simple error boundary component
const RouteErrorBoundary = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="route-error">
        <h1>Oops!</h1>
        <h2>{error.status}</h2>
        <p>{error.statusText}</p>
        {error.data?.message && <p>{error.data.message}</p>}
      </div>
    );
  }

  return (
    <div className="route-error">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{(error as Error)?.message || 'Unknown error'}</i>
      </p>
    </div>
  );
};

// Router configuration
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
            <AuthComponent />
          </Suspense>
        ),
        action: authAction,
      },
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
            <DashboardComponent />
          </Suspense>
        ),
        loader: dashboardLoader,
      },
    ],
  },
]);
