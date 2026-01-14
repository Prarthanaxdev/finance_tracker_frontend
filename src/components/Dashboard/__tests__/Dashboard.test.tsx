/*
  Dashboard.test.tsx
  This test file verifies that the Dashboard component renders without crashing, using mocked router loader data and context. It ensures the component and its lazy-loaded children can mount in isolation from the real app/router.
*/

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { Suspense } from 'react';
import Dashboard from '../Dashboard';

// Mock the entire react-router-dom module, but override useLoaderData to always return mock dashboard data for all components in this test file.
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  const mockLoaderData = {
    summary: { data: { income: 0, expense: 0 } },
    monthlyTrends: { data: [] },
    categoryBreakdown: { data: [] },
  };
  return {
    ...actual,
    useLoaderData: vi.fn().mockReturnValue(mockLoaderData),
  };
});

// Basic smoke test for Dashboard component
describe('Dashboard Component', () => {
  it('renders without crashing', () => {
    const router = createMemoryRouter([
      {
        path: '/',
        element: <Dashboard />,
      },
    ]);
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>,
    );
    // Check for a heading or main element
    // (Update selector as needed based on your Dashboard implementation)
    expect(screen.getAllByText(/dashboard|summary|finance/i)[0]).toBeInTheDocument();
  });
});
