import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import styled, { keyframes, ThemeProvider } from 'styled-components';
import { cn } from "@/lib/utils"

// ===============================
// 1. Theme Definition (Reusing)
// ===============================
const theme = {
    ghostDark: '#121212',
    neonPurple: '#9333EA',
    neonCyan: '#06B6D4',
    ghostGray: '#272727',
    white: '#FFFFFF',
    transparent: 'transparent',
    red: '#DC2626'
};

// ===============================
// 2. Reusable Animation Keyframes
// ===============================
const pulse = keyframes`
  0% { opacity: 0.4; transform: scale(0.8); }
  50% { opacity: 0.8; transform: scale(1.2); }
  100% { opacity: 0.4; transform: scale(0.8); }
`;

// ===============================
// 3. Styled Components
// ===============================
const PulseContainer = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
  background-color: ${({ color }) => color};
  opacity: 0.6;
  animation: ${pulse} 2s infinite ease-in-out;
  z-index: -1;
  box-shadow: 0 0 15px ${({ color }) => color};
`;

interface AnchorPulseFXProps {
    color?: string;
    size?: string;
    children?: React.ReactNode;
}

const AnchorPulseFX: React.FC<AnchorPulseFXProps> = ({
    color = theme.neonCyan,
    size = '150px',
    children,
}) => {
    return (
        <div style={{ position: 'relative', display: 'inline-flex' }}>
            <PulseContainer
                color={color}
                size={size}
            />
            {children}
        </div>
    );
};

export default AnchorPulseFX;
