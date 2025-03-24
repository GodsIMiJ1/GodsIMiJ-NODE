import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { keyframes, ThemeProvider } from 'styled-components';
import { Button } from '@/components/ui/button'; // Assuming you have shadcn/ui
import {
    Zap,        // For Trigger Action
    Eye,        // For Scan
    Wand2,      // For Auto-Patch
    MessageSquare, // For Whisper
    ListChecks, // For Activity Log
    Terminal,   // For Command Tray
    ArrowRight,   // For send
    XCircle,     // For close
    Cpu,
    BrainCircuit,
    Sparkles,
    Ghost
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

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const slideOut = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
`;

// ===============================
// 3. Styled Components
// ===============================

// --- 3.1 Action Panel Components ---
const PanelContainer = styled(motion.div)`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* Right-align buttons */
  gap: 1rem;
  z-index: 20;
`;

const ActionButton = styled(Button)`
  background-color: ${({ theme }) => theme.ghostGray};
  color: ${({ theme }) => theme.neonCyan};
  border: 2px solid ${({ theme }) => theme.neonPurple};
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
  width: 200px; /* Consistent button width */
  display: flex; /* Use flexbox for icon alignment */
  align-items: center;
  justify-content: flex-start; /* Align icon to the start */
  gap: 0.75rem;

  &:hover {
    background-color: ${({ theme }) => theme.neonPurple};
    color: ${({ theme }) => theme.ghostDark};
    border-color: ${({ theme }) => theme.neonCyan};
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  }

  .icon {
    width: 20px;
    height: 20px;
  }
`;

// --- 3.2 Command Tray Components ---
const TrayContainer = styled(motion.div)`
  position: fixed; /* Use fixed positioning */
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.ghostGray};
  border-top: 2px solid ${({ theme }) => theme.neonPurple};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  z-index: 30;
  animation: ${fadeIn} 0.3s ease;
  height: auto;
  max-height: 80vh;
  overflow-y: auto;
`;

const TrayHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const TrayTitle = styled.h2`
  color: ${({ theme }) => theme.white};
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled(Button)`
  background: transparent;
  color: ${({ theme }) => theme.neonCyan};
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
`;

const CommandInput = styled.input`
  background-color: ${({ theme }) => theme.ghostDark};
  color: ${({ theme }) => theme.white};
  border: 2px solid ${({ theme }) => theme.neonPurple};
  padding: 0.75rem;
  font-size: 0.9rem;
  flex: 1;
  border-radius: 6px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.neonCyan};
    box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.3);
  }
`;

const SendButton = styled(Button)`
  background-color: ${({ theme }) => theme.neonPurple};
  color: ${({ theme }) => theme.ghostDark};
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.neonCyan};
    transform: translateX(2px);
  }

  &:active {
    transform: translateX(0);
  }
`;

const OutputContainer = styled.div`
  margin-top: 1.5rem;
  max-height: 300px;
  overflow-y: auto;
  font-size: 0.85rem;
  font-family: monospace;
  color: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.neonPurple};
  padding: 1rem;
  background-color: rgba(0,0,0,0.2);
  border-radius: 8px;
`;

const OutputLine = styled.div`
  margin-bottom: 0.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  word-break: break-word;
`;

// --- 3.3 Activity Log Components ---
const LogContainer = styled(motion.div)`
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: ${({ theme }) => theme.ghostGray};
  border: 2px solid ${({ theme }) => theme.neonPurple};
  padding: 1rem;
  max-height: 300px;
  overflow-y: auto;
  width: 350px;
  z-index: 20;
  animation: ${fadeIn} 0.5s ease;
  border-radius: 8px;
`;

const LogTitle = styled.h3`
  color: ${({ theme }) => theme.white};
  font-size: 1.2rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LogEntry = styled.div`
  margin-bottom: 0.75rem;
  font-size: 0.85rem;
  color: ${({ theme, type }) => {
        switch (type) {
            case 'error': return theme.red;
            case 'warning': return '#F59E0B'; // Tailwind amber-500
            default: return theme.neonCyan;
        }
    }};
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  word-break: break-word;
`;

// ===============================
// 4. Component Implementations
// ===============================

// --- 4.1 Action Panel ---
const ActionPanel = ({ onInvoke }: { onInvoke: (command: string) => void }) => {
    const [isTrayOpen, setIsTrayOpen] = useState(false);
    const [command, setCommand] = useState('');
    const [output, setOutput] = useState<string[]>([]);
    const [logEntries, setLogEntries] = useState<{ type: 'info' | 'error' | 'warning', message: string }[]>([]);

    const handleAction = (action: string) => {
        // Simulate action and log
        const message = `[NODE]: Triggered action - ${action}`;
        console.log(message);
        setLogEntries(prev => [...prev, { type: 'info', message }]);

        // Simulate sending command to a "parent" component or context
        onInvoke(action); // Notify parent
    };

    const handleSendCommand = () => {
        if (command.trim()) {
            const message = `[USER]: Issued command - ${command}`;
            console.log(message);
            setLogEntries(prev => [...prev, { type: 'info', message }]);
            setOutput(prev => [...prev, `> ${command}`]);

            // Simulate AI response
            setTimeout(() => {
                const response = `[NODE]: Command "${command}" executed.  Result: Success.`;
                console.log(response);
                setOutput(prev => [...prev, response]);
                setCommand('');
            }, 1000);
        }
    };

    const handleCloseTray = () => {
        setIsTrayOpen(false);
        setOutput([]);
        setCommand('');
    }

    return (
        <>
            <PanelContainer>
                <ActionButton onClick={() => handleAction('SCAN')}>
                    <Eye className="icon" /> Scan Flow
                </ActionButton>
                <ActionButton onClick={() => handleAction('AUTO-PATCH')}>
                    <Wand2 className="icon" /> Auto-Patch
                </ActionButton>
                <ActionButton onClick={() => handleAction('TRIGGER')}>
                    <Zap className="icon" /> Trigger Action
                </ActionButton>
                <ActionButton onClick={() => setIsTrayOpen(true)}>
                    <Terminal className="icon" /> Open Command Tray
                </ActionButton>
                <ActionButton onClick={() => handleAction('ACTIVITY_LOG')}>
                    <ListChecks className="icon" /> Show Activity Log
                </ActionButton>
            </PanelContainer>

            <AnimatePresence>
                {isTrayOpen && (
                    <TrayContainer
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    >
                        <TrayHeader>
                            <TrayTitle>
                                <Terminal className="w-6 h-6" />
                                NODE Command Tray
                            </TrayTitle>
                            <CloseButton onClick={handleCloseTray}>
                                <XCircle className="w-6 h-6" />
                            </CloseButton>
                        </TrayHeader>
                        <OutputContainer>
                            {output.map((line, index) => (
                                <OutputLine key={index}>
                                    {line.startsWith('[') ? null : <ArrowRight className="w-4 h-4" />}
                                    {line}
                                </OutputLine>
                            ))}
                        </OutputContainer>
                        <InputContainer>
                            <CommandInput
                                type="text"
                                placeholder="Enter command..."
                                value={command}
                                onChange={(e) => setCommand(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSendCommand();
                                    }
                                }}
                            />
                            <SendButton onClick={handleSendCommand}>
                                <ArrowRight className="w-5 h-5" />
                            </SendButton>
                        </InputContainer>
                    </TrayContainer>
                )}
            </AnimatePresence>

            {/* Activity Log (Simplified -  Normally would be a separate component) */}
            <AnimatePresence>
                {logEntries.length > 0 && (
                    <LogContainer>
                        <LogTitle><ListChecks className="w-5 h-5" /> Activity Log</LogTitle>
                        {logEntries.map((entry, index) => (
                            <LogEntry key={index} type={entry.type}>
                                {entry.type === 'error' && <XCircle className="w-4 h-4" color={theme.red} />}
                                {entry.type === 'warning' && <AlertTriangle className="w-4 h-4" color="#F59E0B" />}
                                {entry.type === 'info' && <Info className="w-4 h-4" color={theme.neonCyan} />}
                                {entry.message}
                            </LogEntry>
                        ))}
                    </LogContainer>
                )}
            </AnimatePresence>
        </>
    );
};

export default ActionPanel;
