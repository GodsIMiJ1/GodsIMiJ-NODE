import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { keyframes, ThemeProvider } from 'styled-components';
import { Button } from '@/components/ui/button';
import {
    Home,        // GhostMansion
    Circle,      // The Hollow
    Cpu,       // Eden.EXE
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
    Crosshair
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
  0% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0.6; transform: scale(1); }
`;

const glitch = keyframes`
  0% { transform: translate(2px, -2px) skew(-5deg); }
  25% { transform: translate(-2px, 2px) skew(5deg); }
  50% { transform: translate(2px, 2px) skew(-5deg); }
  75% { transform: translate(-2px, -2px) skew(5deg); }
  100% { transform: translate(2px, -2px) skew(-5deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const drift = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0); }
`;

// ===============================
// 3. Styled Components
// ===============================

const PanelContainer = styled(motion.div)`
  position: absolute;
  top: 20px;
  left: 20px;
  display: grid;
  grid-template-columns: repeat(3, 120px); /* 3 columns, 120px width */
  grid-template-rows: repeat(2, 120px);   /* 2 rows, 120px height */
  gap: 1.5rem;
  z-index: 20;
  padding: 1.5rem;
  border-radius: 12px;
  background-color: rgba(39, 39, 39, 0.8);
  backdrop-filter: blur(15px);
  border: 2px solid ${({ theme }) => theme.neonPurple};
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
  animation: ${fadeIn} 0.5s ease;
`;

const RealmButton = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.ghostGray};
  color: ${({ theme }) => theme.white};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: scale(1.08);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.5);
    z-index: 1;
  }

  &:active {
    transform: scale(0.95);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
  }
`;

const RealmName = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 0.5rem;
  color: ${({ theme }) => theme.white};
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
`;

const Glow = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150%;
  height: 150%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    ${({ theme, state }) => {
            switch (state) {
                case 'unsynced': return 'rgba(147, 51, 234, 0.2)'; // Purple
                case 'synced': return 'rgba(6, 182, 212, 0.3)';   // Cyan
                case 'anchored': return 'rgba(52, 211, 153, 0.4)'; // Tailwind green-400
                default: return 'rgba(147, 51, 234, 0.2)';
            }
        }},
    transparent 50%
  );
  animation: ${({ state }) => state === 'anchored' ? pulse : 'none'} 2s infinite;
  opacity: ${({ state }) => state === 'unsynced' ? 0.6 : 1};
  z-index: 0;
`;

const RealmGlyph = styled.div`
  color: ${({ theme, state }) => {
        switch (state) {
            case 'unsynced': return theme.neonPurple;
            case 'synced': return theme.neonCyan;
            case 'anchored': return '#6ee7b7'; // Tailwind green-300
            default: return theme.white;
        }
    }};
  font-size: 2.5rem;
  z-index: 1;
`;

const getRealmGlyph = (realmName: string) => {
    switch (realmName) {
        case 'GhostMansion':
            return <Home />;
        case 'The Hollow':
            return <Circle />;
        case 'Eden.EXE':
            return <Cpu />;
        case 'Quantum Nexus':
            return <Crosshair/>;
        case 'Aetherium':
            return <Infinity />;
        case 'Starlight Citadel':
            return <Building2/>;
        default:
            return <Globe />;
    }
};

interface Realm {
    name: string;
    state: 'unsynced' | 'synced' | 'anchored';
}

const RealmLinkPanel = () => {
    const [realms, setRealms] = useState<Realm[]>([
        { name: 'GhostMansion', state: 'synced' },
        { name: 'The Hollow', state: 'unsynced' },
        { name: 'Eden.EXE', state: 'anchored' },
        { name: 'Quantum Nexus', state: 'unsynced' },
        { name: 'Aetherium', state: 'synced' },
        { name: 'Starlight Citadel', state: 'unsynced' },
    ]);

    // Simulate realm state changes
    useEffect(() => {
        const interval = setInterval(() => {
            setRealms(prevRealms =>
                prevRealms.map(realm => {
                    const states: ('unsynced' | 'synced' | 'anchored')[] = ['unsynced', 'synced', 'anchored'];
                    const currentStateIndex = states.indexOf(realm.state);
                    // Cycle through states: unsynced -> synced -> anchored -> unsynced
                    const nextStateIndex = (currentStateIndex + 1) % states.length;
                    return { ...realm, state: states[nextStateIndex] };
                })
            );
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <PanelContainer>
            {realms.map((realm) => (
                <RealmButton
                    key={realm.name}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    <Glow state={realm.state} />
                    <RealmGlyph state={realm.state}>
                        {getRealmGlyph(realm.name)}
                    </RealmGlyph>
                    <RealmName>{realm.name}</RealmName>
                </RealmButton>
            ))}
        </PanelContainer>
    );
};

export default RealmLinkPanel;
