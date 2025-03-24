import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import styled, { keyframes, ThemeProvider } from 'styled-components';
import { Zap, Wifi, Repeat, Activity, Circle, Hexagon } from 'lucide-react';
import { cn } from "@/lib/utils"

// ===============================
// 1. Theme Definition (Reusing from main file)
// ===============================
const theme = {
    ghostDark: '#121212',
    neonPurple: '#9333EA',
    neonCyan: '#06B6D4',
    ghostGray: '#272727',
    white: '#FFFFFF',
    transparent: 'transparent'
};

// ===============================
// 2. Reusable Animation Keyframes
// ===============================
const pulse = keyframes`
  0% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0.6; transform: scale(1); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// ===============================
// 3. Helper Functions
// ===============================
const calculateArc = (percent: number, radius: number) => {
    const circumference = 2 * Math.PI * radius;
    const arcLength = circumference * (percent / 100);
    return arcLength;
};

// ===============================
// 4. Styled Components
// ===============================
const HUDContainer = styled(motion.div)`
  position: absolute;
  top: 20px;
  left: 20px; /* Changed from right to left */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  border-radius: 50%; /* Make it circular */
  background-color: rgba(39, 39, 39, 0.8); /* ghostGray with opacity */
  border: 2px solid ${({ theme }) => theme.neonPurple};
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
  z-index: 10;
  width: 200px; /* Fixed width and height for circular shape */
  height: 200px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    scale: 1.05;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
  }
`;

const Title = styled.h3`
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.white};
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
`;

const WheelContainer = styled.div`
  position: relative;
  width: 120px; /* Fixed size to match the circular container */
  height: 120px;
  margin-bottom: 1rem;
`;

const WheelBackground = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.3); /* Darker background */
  position: absolute;
`;

const WheelPath = styled(motion.svg)`
  width: 100%;
  height: 100%;
  position: absolute;
  transform: rotate(-90deg); /* Start from the top */
`;

const Arc = styled.path`
  fill: none;
  stroke: ${({ theme, color }) => color};
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease;
`;

const CenterContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.white};
`;

const Percentage = styled(motion.div)`
  font-size: 1.5rem;
  font-weight: bold;
`;

const Label = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.neonCyan};
  opacity: 0.8;
`;

const IconContainer = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(147, 51, 234, 0.2); /* Lighter background */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.neonCyan};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 0.75rem;
`;

const Tooltip = styled(motion.div)`
  position: absolute;
  top: 120%; /* Position below the HUD */
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ theme }) => theme.ghostGray};
  color: ${({ theme }) => theme.white};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  white-space: nowrap;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  z-index: 100;
  pointer-events: none; /* Important: Allows clicks to pass through */
`;

// ===============================
// 5. Component Implementation
// ===============================
const StatusWheelHUD = () => {
    const [power, setPower] = useState(75);
    const [stability, setStability] = useState(92);
    const [flowLoops, setFlowLoops] = useState(7);
    const [systemIntegrity, setSystemIntegrity] = useState<'green' | 'yellow' | 'red'>('green');
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipData, setTooltipData] = useState('');

    const powerArcRef = useRef<SVGCircleElement>(null);
    const stabilityArcRef = useRef<SVGCircleElement>(null);

    // --- 5.1 Animation ---
    useEffect(() => {
        // --- 5.1.1 Power Animation ---
        if (powerArcRef.current) {
            const radius = 50;
            const arcLength = calculateArc(power, radius);
            const circumference = 2 * Math.PI * radius;

            animate(0, arcLength, {
                duration: 1,
                ease: "easeInOut",
                onUpdate: (value) => {
                    if (powerArcRef.current) {
                        powerArcRef.current.style.strokeDashoffset = `${circumference - value}`;
                    }
                },
            });
        }

        // --- 5.1.2 Stability Animation---
        if (stabilityArcRef.current) {
            const radius = 50;
            const arcLength = calculateArc(stability, radius);
            const circumference = 2 * Math.PI * radius;

            animate(0, arcLength, {
                duration: 1,
                ease: "easeInOut",
                onUpdate: (value) => {
                    if (stabilityArcRef.current) {
                        stabilityArcRef.current.style.strokeDashoffset = `${circumference - value}`;
                    }
                },
            });
        }
    }, [power, stability]);

    // --- 5.2 Effects ---
    useEffect(() => {
        const interval = setInterval(() => {
            // Simulate data changes
            setPower(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 10)));
            setStability(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 5)));
            setFlowLoops(prev => (prev + 1) % 10); // Cycle through 0-9
            setSystemIntegrity(prev => {
                const rand = Math.random();
                if (rand < 0.1) return 'red';       // 10% chance of red
                else if (rand < 0.3) return 'yellow';  // 20% chance of yellow
                else return 'green';            // 70% chance of green
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const getIntegrityColor = () => {
        switch (systemIntegrity) {
            case 'green': return theme.neonCyan;
            case 'yellow': return '#F59E0B'; // Tailwind amber-500
            case 'red': return '#EF4444';    // Tailwind red-500
            default: return theme.neonCyan;
        }
    };

    return (
        <HUDContainer
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <Title>NODE Status</Title>
            <WheelContainer>
                <WheelBackground />
                <WheelPath>
                    {/* Power Arc */}
                    <Arc
                        ref={powerArcRef}
                        d={`M 60 10 A 50 50 0 ${power > 50 ? 1 : 0} 1 ${110} ${60}`}
                        color={theme.neonPurple}
                        strokeDasharray={`${calculateArc(100, 50)} ${calculateArc(100, 50)}`}
                        style={{
                            strokeDashoffset: calculateArc(100, 50) - calculateArc(power, 50),
                        }}
                        onMouseEnter={() => {
                            setShowTooltip(true);
                            setTooltipData(`Power: ${power}%`);
                        }}
                        onMouseLeave={() => setShowTooltip(false)}
                    />
                    {/* Stability Arc */}
                    <Arc
                        ref={stabilityArcRef}
                        d={`M 60 10 A 50 50 0 ${stability > 50 ? 1 : 0} 1 ${110} ${60}`}
                        color={theme.neonCyan}
                        strokeDasharray={`${calculateArc(100, 50)} ${calculateArc(100, 50)}`}
                        style={{
                            strokeDashoffset: calculateArc(100, 50) - calculateArc(stability, 50),
                        }}
                        transform="rotate(120 60 60)" // Rotate stability arc
                        onMouseEnter={() => {
                            setShowTooltip(true);
                            setTooltipData(`Stability: ${stability}%`);
                        }}
                        onMouseLeave={() => setShowTooltip(false)}
                    />
                </WheelPath>
                <CenterContent>
                    <Percentage
                        style={{ color: getIntegrityColor() }}
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [1, 0.8, 1],
                        }}
                        transition={{
                            loop: Infinity,
                            duration: 2,
                            ease: "easeInOut",
                            times: [0, 0.5, 1],
                        }}
                    >
                        {systemIntegrity === 'green' && <><CheckCircle className="inline-block w-6 h-6 mr-1" color={getIntegrityColor()}/> OK</>}
                        {systemIntegrity === 'yellow' && <><AlertTriangle className="inline-block w-6 h-6 mr-1" color={getIntegrityColor()}/> Warning</>}
                        {systemIntegrity === 'red' && <><AlertTriangle className="inline-block w-6 h-6 mr-1" color={getIntegrityColor()}/> Critical</>}
                    </Percentage>
                </CenterContent>
            </WheelContainer>

            {/* Status Items */}
            <StatusItem
                onMouseEnter={() => {
                  setShowTooltip(true);
                  setTooltipData(`Power: ${power}%`);
                }}
                onMouseLeave={() => setShowTooltip(false)}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconContainer><Zap className="w-5 h-5" /></IconContainer>
                    <span>Power</span>
                </div>
                <span style={{ color: theme.white }}>{power}%</span>
            </StatusItem>
            <StatusItem
                onMouseEnter={() => {
                    setShowTooltip(true);
                    setTooltipData(`Stability: ${stability}%`);
                }}
                onMouseLeave={() => setShowTooltip(false)}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconContainer><Wifi className="w-5 h-5" /></IconContainer>
                    <span>Stability</span>
                </div>
                <span style={{ color: theme.white }}>{stability}%</span>
            </StatusItem>
            <StatusItem
                onMouseEnter={() => {
                    setShowTooltip(true);
                    setTooltipData(`Flow Loops: ${flowLoops}`);
                }}
                onMouseLeave={() => setShowTooltip(false)}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconContainer>
                      <Repeat
                        className="w-5 h-5"
                        style={{ animation: `${spin} ${2 + flowLoops * 0.5}s infinite linear` }} // Varying speed
                      />
                    </IconContainer>
                    <span>Flow Loops</span>
                </div>
                <span style={{ color: theme.white }}>{flowLoops}</span>
            </StatusItem>
            <AnimatePresence>
              {showTooltip && (
                <Tooltip
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {tooltipData}
                </Tooltip>
              )}
            </AnimatePresence>
        </HUDContainer>
    );
};

export default StatusWheelHUD;
