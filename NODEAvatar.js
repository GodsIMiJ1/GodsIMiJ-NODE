import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const pulse = keyframes`
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
`;

const drift = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0); }
`;

const AvatarContainer = styled(motion.div)`
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const GhostGlyph = styled(motion.div)`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, ${({ theme }) => theme.neonCyan}, ${({ theme }) => theme.neonPurple});
  border-radius: 50%;
  box-shadow: 0 0 20px ${({ theme }) => theme.neonPurple};
  animation: ${pulse} 2s infinite ease-in-out, ${drift} 3s infinite ease-in-out;
`;

const NODEAvatar = () => {
  return (
    <AvatarContainer
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <GhostGlyph />
    </AvatarContainer>
  );
};

NODEAvatar.defaultProps = {
  theme: {
    neonPurple: '#9333EA',
    neonCyan: '#06B6D4'
  }
}

export default NODEAvatar;
