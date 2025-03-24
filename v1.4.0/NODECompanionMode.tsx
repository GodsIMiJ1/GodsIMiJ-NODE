import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { keyframes, ThemeProvider } from 'styled-components';
import { Button } from '@/components/ui/button'; // Assuming you have shadcn/ui
import {
    Cpu,        // For Assistant Mode
    BrainCircuit, // For Autonomous Mode
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
    Circle,
    Hexagon
} from 'lucide-react';
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
    transparent: 'transparent',
    red: '#DC2626'
};

// ===============================
// 2. Reusable Animation Keyframes
// ===============================
const pulse = keyframes`
  0% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0.7; transform: scale(1); }
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
// --- 3.1 App Container ---
const AppContainer = styled.div`
  height: 100vh;
  width: 100vw;
  position: relative;
  display: flex; /* Use flexbox for layout */
  flex-direction: column;
  align-items: center; /* Center content horizontally */
  justify-content: center; /* Center content vertically */
  padding: 20px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.ghostDark};
`;

// --- 3.2 Avatar Components ---
const AvatarContainer = styled(motion.div)`
  position: relative; /* Allows for absolute positioning of effects */
  width: 120px; /* Increased size */
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-bottom: 2rem; /* Add some margin below the avatar */
`;

const GhostGlyph = styled(motion.div)`
  width: 80px; /* Increased size */
  height: 80px;
  background: linear-gradient(135deg, ${({ theme, mode }) => mode === 'assistant' ? theme.neonCyan : theme.neonPurple}, ${({ theme, mode }) => mode === 'assistant' ? theme.neonPurple : theme.neonCyan});
  border-radius: 50%;
  box-shadow: 0 0 30px ${({ theme, mode }) => mode === 'assistant' ? theme.neonCyan : theme.neonPurple}; /* More pronounced glow */
  animation: ${props => props.mode === 'assistant' ? pulse : glitch} 2.5s infinite ease-in-out, ${drift} 4s infinite ease-in-out; /* Adjusted animation speeds */
`;

const GlowEffect = styled(motion.div)`
  position: absolute;
  width: 150%; /* Larger glow */
  height: 150%;
  background: radial-gradient(
    circle,
    rgba(147, 51, 234, 0.3) 0%,  /* Lighter, more diffuse glow */
    rgba(6, 182, 212, 0) 70%
  );
  border-radius: 50%;
  animation: ${pulse} 3s infinite ease-in-out; /* Slightly different pulse */
  opacity: ${({ mode }) => mode === 'autonomous' ? 0.8 : 1};
`;

const ParticlesEffect = styled.div`
  position: absolute;
  top: -20%;
  left: -20%;
  width: 140%;
  height: 140%;
  pointer-events: none;
  &::before {
      content: '';
      position: absolute;
      top: 10%;
      left: 20%;
      width: 6px;
      height: 6px;
      background-color: ${({ theme, mode }) => mode === 'assistant' ? theme.neonCyan : theme.neonPurple};
      border-radius: 50%;
      opacity: ${({ mode }) => mode === 'assistant' ? 0.6 : 0.8};
      animation: ${drift} 2s infinite ease-in;
  }
    &::after{
      content: '';
      position: absolute;
      top: 60%;
      left: 70%;
      width: 4px;
      height: 4px;
      background-color: ${({ theme, mode }) => mode === 'assistant' ? theme.neonPurple : theme.neonCyan};
      border-radius: 50%;
      opacity: ${({ mode }) => mode === 'assistant' ? 0.8 : 0.6};
      animation: ${drift} 3s infinite ease-out;
  }
`;

// --- 3.3 Whisper Console Components ---
const ConsoleContainer = styled(motion.div)`
  background-color: ${({ theme }) => theme.ghostGray};
  border: 2px solid ${({ theme }) => theme.neonPurple};
  padding: 1.5rem;
  font-family: monospace;
  font-size: 0.9rem;
  position: absolute;
  bottom: 30px;
  left: 30px;
  width: 350px;
  max-height: 250px;
  overflow-y: auto;
  color: ${({ theme }) => theme.neonCyan};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  animation: ${fadeIn} 0.5s ease;
  z-index: 10;
`;

const GlitchText = styled.span`
  animation: ${glitch} 0.1s infinite;
`;

const MessageWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  word-break: break-word;
`;

// --- 3.4 Flow Status HUD Components ---
const HUDContainer = styled(motion.div)`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: ${({ theme }) => theme.ghostGray};
  border: 2px solid ${({ theme }) => theme.neonPurple};
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.neonCyan};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  z-index: 10;
  animation: ${fadeIn} 0.5s ease;
`;

const HUDItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// --- 3.5 Toast Components ---
const ToastContainer = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 1000;
  pointer-events: none;
`;

const Toast = styled(motion.div)`
  background-color: ${({ theme, type }) => {
        switch (type) {
            case 'success': return 'rgba(56, 189, 248, 0.9)';
            case 'error': return 'rgba(244, 114, 182, 0.9)';
            case 'info':
            default: return 'rgba(147, 51, 234, 0.9)';
        }
    }};
  color: ${({ theme, type }) => {
        switch (type) {
            case 'success': return theme.ghostDark;
            case 'error': return theme.ghostDark;
            case 'info':
            default: return theme.white;
        }
    }};
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 250px;
  pointer-events: all;
  backdrop-filter: blur(10px);
`;

const ToastIcon = styled.div`
  color: ${({ theme, type }) => {
        switch (type) {
            case 'success': return theme.ghostDark;
            case 'error': return theme.ghostDark;
            case 'info':
            default: return theme.white;
        }
    }};
`;

const ToastMessage = styled.div`
  flex: 1;
  word-break: break-word;
`;

const DismissButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme, type }) => {
        switch (type) {
            case 'success': return theme.ghostDark;
            case 'error': return theme.ghostDark;
            case 'info':
            default: return theme.white;
        }
    }};
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  padding: 0;
  line-height: 0;

  &:hover {
    opacity: 1;
  }
`;

// --- 3.6 Companion Mode Components ---
const ModeSwitchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  z-index: 20;
`;

const ModeLabel = styled.span`
  color: ${({ theme }) => theme.white};
  font-size: 0.9rem;
  font-weight: 500;
`;

const ModeSwitch = styled(motion.button)`
  position: relative;
  width: 60px;
  height: 30px;
  border-radius: 15px;
  background-color: ${({ theme, mode }) => mode === 'assistant' ? theme.ghostGray : theme.neonPurple};
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: 2px solid ${({ theme }) => theme.neonPurple};
  display: flex;
  align-items: center;
  padding: 0.25rem;
`;

const SwitchThumb = styled(motion.div)`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.white};
  position: absolute;
  top: 3px;
  left: ${({ mode }) => mode === 'assistant' ? '3px' : 'calc(100% - 27px)'};
  transition: left 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
`;

// ===============================
// 4. Component Implementations
// ===============================

// --- 4.1 Whisper Console ---
const WhisperConsole = ({ messages, mode }: { messages: string[], mode: 'assistant' | 'autonomous' }) => {
    const [displayedMessages, setDisplayedMessages] = useState<string[]>([]);
    const consoleRef = useRef<HTMLDivElement>(null);

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
                    if (consoleRef.current) {
                        consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
                    }
                }
            };

            intervalId = setInterval(mode === 'assistant' ? 40 : 80,);

            return () => clearInterval(intervalId);
        }
    }, [messages, displayedMessages, mode]);

    return (
        <ConsoleContainer ref={consoleRef}>
            <Terminal className="w-5 h-5 mb-1 text-neonCyan" />
            {displayedMessages.map((char, index) => (
                <GlitchText key={index}>{char}</GlitchText>
            ))}
        </ConsoleContainer>
    );
};

// --- 4.2 Flow Status HUD ---
const FlowStatusHUD = ({ activeFlows, realmSync, powerLevel, mode }: { activeFlows: number, realmSync: string, powerLevel: string, mode: 'assistant' | 'autonomous' }) => {
    return (
        <HUDContainer>
            <HUDItem>
                <Activity className="w-4 h-4 text-neonCyan" />
                <span>Active Flows: <span className="text-white">{activeFlows}</span></span>
            </HUDItem>
            <HUDItem>
                <Wifi className="w-4 h-4 text-neonCyan" />
                <span>Realm Sync: <span className="text-white">{realmSync}</span></span>
            </HUDItem>
            <HUDItem>
                <Zap className="w-4 h-4 text-neonCyan" />
                <span>NODE Power: <span className="text-white">{powerLevel}</span></span>
            </HUDItem>
        </HUDContainer>
    );
};

// --- 4.3 Toast Component ---
const ToastMessageComponent = ({ message, type, onDismiss }: { message: string, type: 'success' | 'error' | 'info', onDismiss: () => void }) => {
    const getIcon = (type: 'success' | 'error' | 'info') => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5" />;
            case 'error':
                return <AlertTriangle className="w-5 h-5" />;
            case 'info':
            default:
                return <Info className="w-5 h-5" />;
        }
    };

    return (
        <Toast
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            type={type}
        >
            <ToastIcon type={type}>{getIcon(type)}</ToastIcon>
            <ToastMessage>{message}</ToastMessage>
            <DismissButton type={type} onClick={onDismiss}>✕</DismissButton>
        </Toast>
    );
};

// --- 4.4 Main App Component ---
function App() {
    const [whispers, setWhispers] = useState<string[]>([]);
    const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' | 'info' }[]>([]);
    const [mode, setMode] = useState<'assistant' | 'autonomous'>('assistant');
    const [isAFK, setIsAFK] = useState(false); // Simulate AFK state

    // Simulate NODE messages and AFK state
    useEffect(() => {
        const assistantMessages = [
            "Awaiting your command, Architect.",
            "Ready to assist.",
            "Scanning system flows.",
            "Neural pathways online.",
            "Connection established."
        ];

        const autonomousMessages = [
            "System autonomy engaged.",
            "Observing environment...",
            "Analyzing anomalies.",
            "Initiating self-optimization.",
            "Guardians protocol active."
        ];

        let messageInterval: NodeJS.Timeout;
        let afkTimeout: NodeJS.Timeout;

        const setNodeMode = (newMode: 'assistant' | 'autonomous') => {
            setMode(newMode);
            if (newMode === 'autonomous') {
                messageInterval = setInterval(() => {
                    const randomIndex = Math.floor(Math.random() * autonomousMessages.length);
                    setWhispers(prev => [...prev, autonomousMessages[randomIndex]]);
                }, 3000);
            } else {
                clearInterval(messageInterval);
                messageInterval = setInterval(() => {
                    const randomIndex = Math.floor(Math.random() * assistantMessages.length);
                    setWhispers(prev => [...prev, assistantMessages[randomIndex]]);
                }, 5000);
            }
        }

        // Initial mode setup
        setNodeMode('assistant');

        // Simulate user activity and AFK
        const handleUserActivity = () => {
            setIsAFK(false);
            clearTimeout(afkTimeout);
            afkTimeout = setTimeout(() => {
                setIsAFK(true);
            }, 10000);
        };

        window.addEventListener('mousemove', handleUserActivity);
        window.addEventListener('keydown', handleUserActivity);
        window.addEventListener('scroll', handleUserActivity);
        handleUserActivity();

        // Switch modes based on AFK status
        useEffect(() => {
            setNodeMode(isAFK ? 'autonomous' : 'assistant');
        }, [isAFK]);

        return () => {
            clearInterval(messageInterval);
            clearTimeout(afkTimeout);
            window.removeEventListener('mousemove', handleUserActivity);
            window.removeEventListener('keydown', handleUserActivity);
            window.removeEventListener('scroll', handleUserActivity);
        };
    }, [isAFK]);

    // Function to add toasts
    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        const id = crypto.randomUUID();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
    };

    // Function to remove toasts
    const dismissToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const toggleMode = () => {
        setMode(prev => prev === 'assistant' ? 'autonomous' : 'assistant');
    };

    return (
        <ThemeProvider theme={theme}>
            <AppContainer>
                <ModeSwitchContainer>
                    <ModeLabel>Mode:</ModeLabel>
                    <ModeSwitch
                        mode={mode}
                        onClick={toggleMode}
                        aria-label="Toggle Companion Mode"
                    >
                        <SwitchThumb mode={mode} />
                        {mode === 'assistant' ? (
                            <Cpu className="w-4 h-4 ml-auto mr-1 text-ghostDark" />
                        ) : (
                            <BrainCircuit className="w-4 h-4 ml-auto mr-1 text-ghostDark"/>
                        )}
                    </ModeSwitch>
                    <ModeLabel>{mode === 'assistant' ? 'Assistant' : 'Autonomous'}</ModeLabel>
                </ModeSwitchContainer>
                <AvatarContainer mode={mode}>
                    <GlowEffect mode={mode} />
                    <GhostGlyph mode={mode} />
                    <ParticlesEffect mode={mode} />
                </AvatarContainer>
                <WhisperConsole messages={whispers} mode={mode} />
                <FlowStatusHUD activeFlows={7} realmSync="Online" powerLevel="92%" mode={mode} />
                <ToastContainer>
                    <AnimatePresence>
                        {toasts.map(toast => (
                            <ToastMessageComponent
                                key={toast.id}
                                message={toast.message}
                                type={toast.type}
                                onDismiss={() => dismissToast(toast.id)}
                            />
                        ))}
                    </AnimatePresence>
                </ToastContainer>
            </AppContainer>
        </ThemeProvider>
    );
}

export default App;

