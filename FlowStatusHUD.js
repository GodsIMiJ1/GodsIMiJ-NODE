import React from 'react';
import styled from 'styled-components';

const HUDContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: ${({ theme }) => theme.ghostGray};
  border: 1px solid ${({ theme }) => theme.neonPurple};
  padding: 0.5rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.neonCyan};
`;

const FlowStatusHUD = ({ activeFlows, realmSync, powerLevel }) => {
  return (
    <HUDContainer>
      <div>Active Flows: {activeFlows}</div>
      <div>Realm Sync: {realmSync}</div>
      <div>NODE Power: {powerLevel}</div>
    </HUDContainer>
  );
};

FlowStatusHUD.defaultProps = {
  theme: {
    ghostGray: '#272727',
    neonPurple: '#9333EA',
    neonCyan: '#06B6D4'
  },
  activeFlows: 0,
  realmSync: 'Offline',
  powerLevel: 'N/A'
}

export default FlowStatusHUD;
