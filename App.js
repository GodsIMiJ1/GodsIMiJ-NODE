import React, { useState, useEffect } from 'react';
import NODEAvatar from './NODEAvatar';
import WhisperConsole from './WhisperConsole';
import FlowStatusHUD from './FlowStatusHUD';
import styled, { ThemeProvider } from 'styled-components';

const theme = {
  ghostDark: '#121212',
  neonPurple: '#9333EA',
  neonCyan: '#06B6D4',
  ghostGray: '#272727',
};

const AppContainer = styled.div`
  height: 100vh;
  width: 100vw;
  position: relative;
`;

function App() {
  const [whispers, setWhispers] = useState([]);

  useEffect(() => {
    const messages = [
      "Scanning flows...",
      "Weak point detected.",
      "Patching initiated...",
      "Realm Sync: Online.",
      "Guardians are watching."
    ];

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * messages.length);
      setWhispers(prev => [...prev, messages[randomIndex]]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <NODEAvatar />
        <WhisperConsole messages={whispers} />
        <FlowStatusHUD activeFlows={3} realmSync="Online" powerLevel="75%" />
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
