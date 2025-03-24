import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    Link,
    Link2,
    Wifi,
    WifiOff
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

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// ===============================
// 3. Styled Components
// ===============================
const HUDContainer = styled(motion.div)`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: rgba(39, 39, 39, 0.8);
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid ${({ theme }) => theme.neonPurple};
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
  z-index: 20;
  animation: ${fadeIn} 0.5s ease;
  backdrop-filter: blur(10px);
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.white};
  font-size: 1.2rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RealmList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  margin-bottom: 1rem;
`;

const RealmItem = styled.li<{ isAnchor: boolean }>`
  color: ${({ theme, isAnchor }) => isAnchor ? '#6ee7b7' : theme.white};
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: ${({ isAnchor }) => isAnchor ? '600' : '400'};
  text-shadow: ${({ isAnchor }) => isAnchor ? '1px 1px 3px rgba(0, 0, 0, 0.8)' : 'none'};
`;

const AnchorIcon = styled(KeyRound)`
    width: 16px;
    height: 16px;
    color: #6ee7b7;
`;

const ConnectionStrength = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StrengthBar = styled.div<{ strength: number }>`
  width: 80px;
  height: 8px;
  background-color: ${({ theme }) => theme.ghostGray};
  border-radius: 4px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${({ strength }) => `${strength}%`};
    background: linear-gradient(
      to right,
      ${({ theme }) => theme.neonPurple},
      ${({ theme }) => theme.neonCyan}
    );
    border-radius: 4px;
    transition: width 0.3s ease;
  }
`;

const RealmStatusHUD = () => {
    const [syncedRealms, setSyncedRealms] = useState<string[]>([
        'GhostMansion',
        'Eden.EXE',
        'Aetherium',
    ]);
    const [anchorRealm, setAnchorRealm] = useState<string>('Eden.EXE');
    const [connectionStrength, setConnectionStrength] = useState<number>(75);

    // Simulate connection strength change
    useEffect(() => {
        const interval = setInterval(() => {
            setConnectionStrength(prev => {
                const change = Math.random() * 20 - 10; // Change by +/- 10
                return Math.max(0, Math.min(100, prev + change));
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <HUDContainer>
            <Title>
                <Link2 className="w-5 h-5" />
                Realm Status
            </Title>
            <RealmList>
                {syncedRealms.map(realm => (
                    <RealmItem key={realm} isAnchor={realm === anchorRealm}>
                        {realm === anchorRealm && <AnchorIcon />}
                        {realm}
                    </RealmItem>
                ))}
            </RealmList>
            <ConnectionStrength>
                <span>Connection:</span>
                <StrengthBar strength={connectionStrength} />
                {connectionStrength > 80 && <Wifi className="w-5 h-5 text-green-400" />}
                {connectionStrength <= 80 && connectionStrength > 40 && <Wifi className="w-5 h-5 text-yellow-400" />}
                {connectionStrength <= 40 && <WifiOff className="w-5 h-5 text-red-400"/>}
            </ConnectionStrength>
        </HUDContainer>
    );
};

export default RealmStatusHUD;
