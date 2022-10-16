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
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </AppSection>
      </EtherContextProvider>
    </MantineProvider>
  );
}

export default App;
