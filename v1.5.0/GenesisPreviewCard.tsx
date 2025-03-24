import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styled, { keyframes, ThemeProvider } from 'styled-components';
import { Button } from '@/components/ui/button'; // Assuming you have shadcn/ui
import {
    Zap,        // General indicator
    Activity,  // For Active Flows
    Wifi,       // For Realm Sync
    Ghost,     // For the Avatar
    Terminal,  // For the Console
    AlertTriangle, // For errors
    Info,        // General Info
    CheckCircle,  // Success
    ToggleLeft,
    ToggleRight,
    Hexagon,
    Globe,
    KeyRound,
    Layers,
    Building2,
    Infinity,
    Crosshair,
    Flame,
    Gem,
    Star,
    Sparkles
} from 'lucide-react';
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
  0% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.7; transform: scale(1); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// ===============================
// 3. Styled Components
// ===============================
const CardContainer = styled(motion.div)`
  background: linear-gradient(
    135deg,
    rgba(147, 51, 234, 0.1),
    rgba(6, 182, 212, 0.1)
  );
  border: 2px solid ${({ theme }) => theme.neonCyan};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
  width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px) scale(1.03);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(147, 51, 234, 0.2),
      transparent
    );
    opacity: 0;
    transition: opacity 0.4s ease;
    animation: ${spin} 4s infinite linear;
    pointer-events: none;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const RealmIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(147, 51, 234, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  color: ${({ theme }) => theme.neonCyan};
  font-size: 3rem;
  animation: ${pulse} 2s infinite;
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.white};
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
`;

const NFTitle = styled.p`
  color: ${({ theme }) => theme.neonCyan};
  font-size: 0.9rem;
  margin-bottom: 1rem;
  text-align: center;
  font-style: italic;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
`;

const EnergyBar = styled.div`
  width: 100%;
  height: 12px;
  background-color: ${({ theme }) => theme.ghostGray};
  border-radius: 6px;
  position: relative;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const EnergyFill = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.neonPurple},
    ${({ theme }) => theme.neonCyan}
  );
  border-radius: 6px;
  width: ${({ energy }) => `${energy}%`};
  transition: width 0.5s ease;
`;

const EnergyLabel = styled.span`
  color: ${({ theme }) => theme.white};
  font-size: 0.75rem;
  text-align: center;
  margin-bottom: 0.5rem;
  opacity: 0.8;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
`;

interface GenesisPreviewCardProps {
    realmName: string;
    nftTitle: string;
}

const GenesisPreviewCard: React.FC<GenesisPreviewCardProps> = ({ realmName, nftTitle }) => {
    const [energy, setEnergy] = useState(85);

    const getRealmIcon = (name: string) => {
        switch (name) {
            case 'Starlight Citadel':
                return <Building2 />;
            case 'Celestial Expanse':
                return <Star />;
            case 'Quantum Forge':
                return <Flame />;
            default:
                return <Gem />;
        }
    }

    // Simulate energy level change
    useEffect(() => {
        const interval = setInterval(() => {
            setEnergy(prev => {
                const change = Math.random() * 20 - 10;
                return Math.max(0, Math.min(100, prev + change));
            });
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return (
        <CardContainer
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <RealmIcon>
                {getRealmIcon(realmName)}
            </RealmIcon>
            <Title>{realmName}</Title>
            <NFTitle>{nftTitle}</NFTitle>
            <EnergyLabel>Energy Level</EnergyLabel>
            <EnergyBar>
                <EnergyFill energy={energy} />
            </EnergyBar>
            <EnergyLabel>{energy}%</EnergyLabel>
        </CardContainer>
    );
};

export default GenesisPreviewCard;
