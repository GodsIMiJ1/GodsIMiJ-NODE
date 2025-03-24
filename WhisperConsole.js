import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const glitch = keyframes`
  0% { transform: translate(2px, -2px); }
  25% { transform: translate(-2px, 2px); }
  50% { transform: translate(2px, 2px); }
  75% { transform: translate(-2px, -2px); }
  100% { transform: translate(2px, -2px); }
`;

const ConsoleContainer = styled.div`
  background-color: ${({ theme }) => theme.ghostGray};
  border: 1px solid ${({ theme }) => theme.neonPurple};
  padding: 1rem;
  font-family: monospace;
  font-size: 0.8rem;
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 300px;
  max-height: 200px;
  overflow-y: auto;
  color: ${({ theme }) => theme.neonCyan};
`;

const GlitchText = styled.span`
  animation: ${glitch} 0.1s infinite;
`;

const WhisperConsole = ({ messages }) => {
  const [displayedMessages, setDisplayedMessages] = useState([]);

  useEffect(() => {
    if (messages.length > displayedMessages.length) {
      const newMessage = messages[messages.length - 1];
      let charIndex = 0;
      let intervalId;

      const typeMessage = () => {
        if (charIndex < newMessage.length) {
          setDisplayedMessages(prev => [...prev, newMessage.charAt(charIndex)]);
          charIndex++;
        } else {
          clearInterval(intervalId);
        }
      };

      intervalId = setInterval(typeMessage, 50);

      return () => clearInterval(intervalId);
    }
  }, [messages, displayedMessages]);

  return (
    <ConsoleContainer>
      {displayedMessages.map((char, index) => (
        <GlitchText key={index}>{char}</GlitchText>
      ))}
    </ConsoleContainer>
  );
};

WhisperConsole.defaultProps = {
  theme: {
    ghostGray: '#272727',
    neonPurple: '#9333EA',
    neonCyan: '#06B6D4'
  },
  messages: []
}

export default WhisperConsole;
