/**
 * @component App
 * @summary Root application component with providers
 * @domain core
 * @type application-root
 * @category core
 */

import { AppProviders } from './providers';
import { AppRouter } from './router';

export const App = () => {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
};
