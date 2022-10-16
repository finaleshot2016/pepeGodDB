import { Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider, Global } from '@mantine/core';
import { EtherContextProvider } from './context/EtherContext';
import AppSection from './components/App/AppSection';
import Dashboard from './pages/Dashboard/Dashboard';
import theme from './styles/theme';
import components from './styles/components';
import global from './styles/global';

function App() {
  return (
    <MantineProvider theme={theme} styles={components} withNormalizeCSS>
      <Global styles={global} />
      <EtherContextProvider>
        <AppSection>
            <Route path="/" element={<Navigate to={'dashboard'} />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </AppSection>
      </EtherContextProvider>
    </MantineProvider>
  );
}

export default App;
