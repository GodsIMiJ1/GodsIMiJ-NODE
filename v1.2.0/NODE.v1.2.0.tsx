import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { keyframes, ThemeProvider } from 'styled-components';
import {
    Activity, // For Active Flows
    Wifi,       // For Realm Sync
    Zap,        // For NODE Power
    Ghost,     // For the Avatar
    Terminal,  // For the Console
    AlertTriangle, // For errors
    Info,        // General Info
    CheckCircle,  // Success
} from 'lucide-react';
import { cn } from "@/lib/utils"

// ===============================
// 1. Theme Definition
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
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
`;

const drift = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-8px); } /* Slightly more pronounced drift */
  100% { transform: translateY(0); }
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
  background: linear-gradient(135deg, ${({ theme }) => theme.neonCyan}, ${({ theme }) => theme.neonPurple});
  border-radius: 50%;
  box-shadow: 0 0 30px ${({ theme }) => theme.neonPurple}; /* More pronounced glow */
  animation: ${pulse} 2.5s infinite ease-in-out, ${drift} 4s infinite ease-in-out; /* Adjusted animation speeds */
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
`;

const ParticlesEffect = styled.div`
  position: absolute;
  top: -20%;
  left: -20%;
  width: 140%;
  height: 140%;
  pointer-events: none; /* Allows clicks to pass through */
  /* Use a canvas or a div with multiple small, animated elements here */
  /* For simplicity, we'll just use a placeholder style */
  &::before {
    content: '';
    position: absolute;
    top: 10%;
    left: 20%;
    width: 6px;
    height: 6px;
    background-color: ${({ theme }) => theme.neonCyan};
    border-radius: 50%;
    opacity: 0.6;
    animation: ${drift} 2s infinite ease-in;
  }
  &::after{
    content: '';
    position: absolute;
    top: 60%;
    left: 70%;
    width: 4px;
    height: 4px;
    background-color: ${({ theme }) => theme.neonPurple};
    border-radius: 50%;
    opacity: 0.8;
    animation: ${drift} 3s infinite ease-out;
  }
`;

const NODEAvatar = () => {
    return (
        <AvatarContainer
            whileHover={{ scale: 1.15 }} /* More pronounced scale */
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }} /* Springier animation */
        >
            <GlowEffect />
            <GhostGlyph />
            <ParticlesEffect />
        </AvatarContainer>
    );
};

// --- 3.3 Whisper Console Components ---
const ConsoleContainer = styled(motion.div)`
  background-color: ${({ theme }) => theme.ghostGray};
  border: 2px solid ${({ theme }) => theme.neonPurple}; /* Thicker border */
  padding: 1.5rem; /* Increased padding */
  font-family: monospace;
  font-size: 0.9rem; /* Slightly larger font */
  position: absolute;
  bottom: 30px; /* More space from bottom */
  left: 30px;  /* More space from left */
  width: 350px; /* Wider console */
  max-height: 250px; /* Increased max height */
  overflow-y: auto;
  color: ${({ theme }) => theme.neonCyan};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5); /* More pronounced shadow */
  border-radius: 8px;
  animation: ${fadeIn} 0.5s ease;
  z-index: 10; /* Ensure console is above other elements */
`;

const GlitchText = styled.span`
  animation: ${glitch} 0.1s infinite;
`;

const MessageWrapper = styled.div`
  display: flex;
  align-items: flex-start; /* Align items to the start (top) */
  gap: 0.5rem; /* Add some gap between icon and text */
  margin-bottom: 0.5rem; /* Add space between messages */
  word-break: break-word; /* handle long words */
`;

// --- 3.4 Flow Status HUD Components ---
const HUDContainer = styled(motion.div)`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: ${({ theme }) => theme.ghostGray};
  border: 2px solid ${({ theme }) => theme.neonPurple}; /* Thicker border */
  padding: 0.75rem 1rem; /* Increased padding */
  font-size: 0.85rem; /* Slightly larger font */
  color: ${({ theme }) => theme.neonCyan};
  display: flex; /* Use flexbox for layout */
  flex-direction: column;
  gap: 0.5rem; /* Add gap between items */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4); /* More pronounced shadow */
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
  position: fixed; /* Use fixed positioning */
  bottom: 20px;
  left: 50%; /* Center horizontally initially */
  transform: translateX(-50%); /* Precise centering */
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 1000; /* Ensure toasts are on top */
  pointer-events: none;  /* Allows clicks to pass through, important for dismiss */
`;

const Toast = styled(motion.div)`
  background-color: ${({ theme, type }) => {
    switch (type) {
      case 'success': return 'rgba(56, 189, 248, 0.9)'; // A lighter cyan for success
      case 'error': return 'rgba(244, 114, 182, 0.9)';   // A brighter pink for error
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
  padding: 1rem 1.5rem; /* Slightly increased horizontal padding */
  border-radius: 8px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5); /* More pronounced shadow */
  font-size: 0.9rem; /* Slightly larger font */
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 250px; /* Ensure toast has a minimum width */
  pointer-events: all; /* Re-enable pointer events for dismiss button */
  backdrop-filter: blur(10px);
`;

const ToastIcon = styled.div`
  /* Use the icon from Lucide */
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
  flex: 1; /* Allow message to take up available space */
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

// ===============================
// 4. Component Implementations
// ===============================

// --- 4.1 Whisper Console ---
const WhisperConsole = ({ messages }) => {
    const [displayedMessages, setDisplayedMessages] = useState([]);
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
                    // Scroll to bottom after message is displayed
                    if (consoleRef.current) {
                        consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
                    }
                }
            };

            intervalId = setInterval(typeMessage, 40); // Adjusted typing speed

            return () => clearInterval(intervalId);
        }
    }, [messages, displayedMessages]);

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
const FlowStatusHUD = ({ activeFlows, realmSync, powerLevel }) => {
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

    // Simulate NODE messages
    useEffect(() => {
        const messages = [
            "Scanning flows...",
            "Weak point detected.",
            "Patching initiated...",
            "Realm Sync: Online.",
            "Guardians are watching.",
            "Flow integrity confirmed.",
            "Neural link stabilized.",
            "Quantum entanglement calibrated.",
            "A temporal anomaly detected.",
            "System optimization in progress..."
        ];

        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * messages.length);
            setWhispers(prev => [...prev, messages[randomIndex]]);

            // Randomly trigger toasts as well
            if (Math.random() < 0.3) { // 30% chance to show a toast
                const toastTypes: ('success' | 'error' | 'info')[] = ['success', 'error', 'info'];
                const randomType = toastTypes[Math.floor(Math.random() * toastTypes.length)];
                const toastMessages = [
                    "Flow patched successfully.",
                    "Error: Connection interrupted.",
                    "Information: New update available.",
                    "Success: Task completed.",
                    "Warning: Temporal distortion detected!",
                    "Info: System diagnostics initiated..."
                ];
                const randomToastMessage = toastMessages[Math.floor(Math.random() * toastMessages.length)];
                showToast(randomToastMessage, randomType);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Function to add toasts
    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        const id = crypto.randomUUID();
        setToasts(prev => [...prev, { id, message, type }]);
        // Auto-remove after 5 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
    };

    // Function to remove toasts
    const dismissToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ThemeProvider theme={theme}>
            <AppContainer>
                <NODEAvatar />
                <WhisperConsole messages={whispers} />
                <FlowStatusHUD activeFlows={7} realmSync="Online" powerLevel="92%" />
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
