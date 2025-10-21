/**
 * @component RootLayout
 * @summary Root layout wrapper for all pages
 * @domain core
 * @type layout-component
 * @category layout
 */

import { Outlet } from 'react-router-dom';

export const RootLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
};
