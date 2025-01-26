import { PreferencesProvider } from '@/contexts/preferencesContext';
import RootLayout from './rootLayout';

export default function App() {
  return (
    <PreferencesProvider>
      <RootLayout />
    </PreferencesProvider>
  );
}
