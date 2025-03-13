import React, { useState } from 'react';
import styled from 'styled-components';
import { User } from '../../interfaces';
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  width: 400px;
  max-width: 90vw;
`;

const UserList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin: 16px 0;
`;

const UserItem = styled.div<{ selected: boolean }>`
  padding: 8px;
  margin: 4px 0;
  border-radius: 4px;
  cursor: pointer;
  background: ${props => props.selected ? '#e6f2fe' : 'transparent'};
  &:hover {
    background: #f0f2f5;
  }
`;

interface CreateGroupModalProps {
    onClose: () => void;
    onCreateGroup: (name: string, userIds: string[]) => void;
    availableUsers: User[];
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
    onClose,
    onCreateGroup,
    availableUsers
}) => {
    const [groupName, setGroupName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (groupName && selectedUsers.length > 0) {
            onCreateGroup(groupName, selectedUsers);
            onClose();
        }
    };

    const toggleUser = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <h2>Create Group Chat</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        value={groupName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGroupName(e.target.value)}
                        placeholder="Group Name"
                        required
                    />
                    <UserList>
                        {availableUsers.map(user => (
                            <UserItem
                                key={user.userID}
                                selected={selectedUsers.includes(user.userID)}
                                onClick={() => toggleUser(user.userID)}
                            >
                                {user.userName}
                            </UserItem>
                        ))}
                    </UserList>
                    <button type="submit" disabled={!groupName || selectedUsers.length === 0}>
                        Create Group
                    </button>
                </form>
            </ModalContent>
        </ModalOverlay>
    );
};

export default CreateGroupModal;