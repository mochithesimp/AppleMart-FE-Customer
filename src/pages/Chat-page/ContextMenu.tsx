import React from 'react';
import styled from 'styled-components';

const MenuContainer = styled.div`
  position: fixed;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 8px 0;
  min-width: 180px;
  z-index: 1000;
`;

const MenuItem = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  &:hover {
    background: #f0f2f5;
  }
`;

interface ContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    options: Array<{
        label: string;
        onClick: () => void;
    }>;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, options, onClose }) => {
    React.useEffect(() => {
        const handleClick = () => onClose();
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [onClose]);

    return (
        <MenuContainer style={{ left: x, top: y }}>
            {options.map((option, index) => (
                <MenuItem key={index} onClick={option.onClick}>
                    {option.label}
                </MenuItem>
            ))}
        </MenuContainer>
    );
};

export default ContextMenu;