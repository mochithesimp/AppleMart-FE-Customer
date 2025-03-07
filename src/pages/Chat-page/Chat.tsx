import React, { useEffect, useRef, useState } from 'react';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';
import axios from 'axios';
import styled from 'styled-components';
import { ChatRoom, Message, User, StyledProps, ApiResponse, unwrapValues } from '../../interfaces';
import { FaPlus, FaUsers, FaPaperPlane } from 'react-icons/fa';
import * as signalR from '@microsoft/signalr';

const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f0f2f5;
`;

const Sidebar = styled.div`
  width: 320px;
  background: white;
  border-right: 1px solid #e4e6eb;
  display: flex;
  flex-direction: column;
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  padding: 16px;
  background: white;
  border-bottom: 1px solid #e4e6eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    margin: 0;
    font-size: 16px;
  }
  
  small {
    color: #65676b;
  }
`;

const OnlineUsers = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e4e6eb;
  overflow-x: auto;
  white-space: nowrap;
  display: flex;
  align-items: center;
`;

const UserAvatar = styled.div<StyledProps>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.isOnline ? '#e4e6eb' : '#ccc'};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.isOnline ? '#31a24c' : '#65676b'};
    border: 2px solid white;
  }
`;

const ChatList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ChatItem = styled.div<StyledProps>`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  background: ${props => props.active ? '#e6f2fe' : 'transparent'};
  transition: background-color 0.2s;
  
  &:hover {
    background: ${props => props.active ? '#e6f2fe' : '#f5f5f5'};
  }

  .chat-info {
    flex: 1;
    overflow: hidden;
    
    h4 {
      margin: 0;
      font-size: 15px;
      color: #050505;
    }
    
    p {
      margin: 4px 0 0;
      font-size: 13px;
      color: #65676b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

const MessageList = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background: #fff;
  gap: 8px;
`;

const MessageGroup = styled.div<StyledProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 8px 0;

  .messages {
    display: flex;
    flex-direction: column;
    align-items: ${props => props.isMine ? 'flex-end' : 'flex-start'};
  }
`;

const MessageBubble = styled.div<StyledProps>`
  max-width: 60%;
  background: ${props => props.isMine ? '#0084ff' : '#e4e6eb'};
  color: ${props => props.isMine ? '#ffffff' : '#050505'};
  padding: 8px 12px;
  margin: 1px 0;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;

  /* First message in group */
  border-radius: ${props => {
    if (props.isFirst && props.isLast) return '18px';
    if (props.isFirst) return props.isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px';
    if (props.isLast) return props.isMine ? '18px 4px 18px 18px' : '4px 18px 18px 18px';
    return props.isMine ? '18px 4px 4px 18px' : '4px 18px 18px 4px';
  }};
`;

const MessageItem = styled.div<StyledProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 4px 0;

  .message-wrapper {
    display: flex;
    justify-content: ${props => props.isMine ? 'flex-end' : 'flex-start'};
    width: 100%;
  }

  .message-content {
    max-width: 60%;
    background: ${props => props.isMine ? '#0084ff' : '#e4e6eb'};
    color: ${props => props.isMine ? '#ffffff' : '#050505'};
    padding: 8px 12px;
    border-radius: 18px;
    font-size: 14px;
    line-height: 1.4;
    word-wrap: break-word;
  }

  .message-meta {
    font-size: 11px;
    color: #65676b;
    margin-top: 4px;
    text-align: ${props => props.isMine ? 'right' : 'left'};
    padding: 0 12px;
  }
`;

const InputArea = styled.div`
  padding: 16px;
  background: white;
  border-top: 1px solid #e4e6eb;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #e4e6eb;
  border-radius: 20px;
  outline: none;
  font-size: 15px;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #0084ff;
  }
`;

const Button = styled.button`
  background: #0084ff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    background: #0073e6;
  }
  
  &:disabled {
    background: #e4e6eb;
    cursor: not-allowed;
  }
`;

const CreateChatButton = styled(Button)`
  margin-right: 12px;
  white-space: nowrap;
`;

const ChatPage: React.FC = () => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [message, setMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.defaults.baseURL = 'https://localhost:7140';

    loadRooms().catch(error => {
      console.error('Error in initial room load:', error);
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.defaults.baseURL = 'https://localhost:7140';
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const newConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7140/chatHub', {
        accessTokenFactory: () => token,
        transport: signalR.HttpTransportType.WebSockets,
        skipNegotiation: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    return () => {
      if (newConnection.state === 'Connected') {
        newConnection.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!connection) return;

    const startConnection = async () => {
      try {
        await connection.start();
        console.log('Connected to SignalR Hub');

        connection.on('ReceiveMessage', (message: Message) => {
          console.log('Received message:', message);

          setRooms(prev => prev.map(room => {
            if (room.chatRoomID === message.chatRoomID) {
              const updatedMessages = room.messages ? [...room.messages, message] : [message];
              return {
                ...room,
                messages: updatedMessages,
                lastMessage: message
              };
            }
            return room;
          }));

          setActiveRoom(prev => {
            if (prev && prev.chatRoomID === message.chatRoomID) {
              const updatedMessages = prev.messages ? [...prev.messages, message] : [message];
              return {
                ...prev,
                messages: updatedMessages,
                lastMessage: message
              };
            }
            return prev;
          });
        });

        connection.on('UserOnline', (userId: string) => {
          console.log('User came online:', userId);
          setOnlineUsers(prev =>
            prev.map(user =>
              user.id === userId ? { ...user, isOnline: true } : user
            )
          );

          setRooms(prev => prev.map(room => ({
            ...room,
            participants: room.participants?.map(p =>
              p.userID === userId ? { ...p, isOnline: true } : p
            )
          })));
        });

        connection.on('UserOffline', (userId: string) => {
          console.log('User went offline:', userId);
          setOnlineUsers(prev =>
            prev.map(user =>
              user.id === userId ? { ...user, isOnline: false } : user
            )
          );

          setRooms(prev => prev.map(room => ({
            ...room,
            participants: room.participants?.map(p =>
              p.userID === userId ? { ...p, isOnline: false } : p
            )
          })));
        });

        await loadRooms();
        await loadOnlineUsers();
      } catch (error) {
        console.error('Connection failed:', error);
      }
    };

    startConnection();
  }, [connection]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [activeRoom?.messages]);

  const loadRooms = async () => {
    try {
      console.log('Loading chat rooms...');
      const response = await axios.get<ApiResponse<ChatRoom>>('/api/chat/rooms');
      console.log('Chat rooms response:', response.data);

      const roomsData = response.data.$values || response.data || [];
      const rooms = roomsData.map(room => ({
        ...room,
        participants: unwrapValues(room.participants || []),
        messages: unwrapValues(room.messages || [])
      }));

      console.log('Processed rooms:', rooms);
      setRooms(rooms);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load chat rooms:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error details:', error.response?.data);
      }
      setRooms([]);
      setLoading(false);
    }
  };

  const loadOnlineUsers = async () => {
    try {
      const response = await axios.get<ApiResponse<User>>('/api/chat/users/online');
      console.log('Online users:', response.data);
      const users = response.data.$values || response.data || [];
      setOnlineUsers(users);
    } catch (error) {
      console.error('Failed to load online users:', error);
      setOnlineUsers([]);
    }
  };

  const handleUserClick = async (userId: string) => {
    try {
      console.log('Creating chat with user:', userId);
      const response = await axios.post<ChatRoom>('/api/chat/room/private', JSON.stringify(userId), {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('Chat room created:', response.data);
      if (response.data) {
        const newRoom = {
          ...response.data,
          participants: unwrapValues(response.data.participants),
          messages: unwrapValues(response.data.messages)
        };

        setRooms(prev => {
          const exists = prev.some(room => room.chatRoomID === newRoom.chatRoomID);
          return exists ? prev : [...prev, newRoom];
        });
        setActiveRoom(newRoom);
        if (connection) {
          await connection.invoke('JoinRoom', newRoom.chatRoomID);
        }
      }
    } catch (error) {
      console.error('Failed to create chat room:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!connection || !activeRoom || !message.trim()) return;

    try {
      console.log('Sending message:', {
        roomId: activeRoom.chatRoomID,
        content: message.trim()
      });

      const messageContent = message.trim();
      setMessage('');

      await connection.invoke('SendMessage', activeRoom.chatRoomID, messageContent);
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleRoomClick = async (room: ChatRoom) => {
    try {
      console.log('Clicking room:', room);

      setActiveRoom(room);

      const response = await axios.get<ChatRoom>(`/api/chat/room/${room.chatRoomID}`);
      console.log('Fetched room data:', response.data);

      const processedRoom = {
        ...response.data,
        messages: unwrapValues(response.data.messages || []),
        participants: unwrapValues(response.data.participants || [])
      };

      setActiveRoom(processedRoom);

      if (connection) {
        await connection.invoke('JoinRoom', room.chatRoomID);
      }
    } catch (error) {
      console.error('Error fetching room data:', error);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        Loading chat...
      </div>
    );
  }

  return (
    <Container>
      <Sidebar>
        <OnlineUsers>
          <CreateChatButton onClick={() => { }}>
            <FaPlus /> New Chat
          </CreateChatButton>
          {onlineUsers.map(user => (
            <UserAvatar
              key={user.id}
              isOnline={user.isOnline}
              onClick={() => handleUserClick(user.id)}
              title={user.userName}
            >
              {user.userName?.[0]?.toUpperCase()}
            </UserAvatar>
          ))}
        </OnlineUsers>
        <ChatList>
          {rooms.map(room => (
            <ChatItem
              key={room.chatRoomID}
              active={room.chatRoomID === activeRoom?.chatRoomID}
              onClick={() => handleRoomClick(room)}
            >
              {room.isGroup && <FaUsers style={{ marginRight: '8px' }} />}
              <div className="chat-info">
                <h4>{room.roomName}</h4>
                <p>{room.lastMessage?.content}</p>
              </div>
            </ChatItem>
          ))}
        </ChatList>
      </Sidebar>
      <ChatArea>
        {activeRoom ? (
          <>
            <ChatHeader>
              <div>
                <h3>{activeRoom.roomName}</h3>
                <small>
                  {activeRoom.isGroup
                    ? `${activeRoom.participants?.length || 0} members`
                    : activeRoom.participants?.some(p => p.isOnline)
                      ? 'Active now'
                      : 'Offline'}
                </small>
              </div>
            </ChatHeader>
            <MessageList ref={messageListRef}>
              {(activeRoom?.messages || [])
                .sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime())
                .reduce((groups, msg) => {
                  const lastGroup = groups[groups.length - 1];
                  if (lastGroup && lastGroup[0].senderID === msg.senderID) {
                    lastGroup.push(msg);
                  } else {
                    groups.push([msg]);
                  }
                  return groups;
                }, [] as Message[][])
                .map((group, groupIndex) => {
                  const isMine = group[0].senderID === localStorage.getItem('userId');
                  return (
                    <MessageGroup key={`group-${groupIndex}`} isMine={isMine}>
                      <div className="messages">
                        {group.map((msg, msgIndex) => (
                          <MessageBubble
                            key={`${msg.chatID}-${msg.createdDate}`}
                            isMine={isMine}
                            isFirst={msgIndex === 0}
                            isLast={msgIndex === group.length - 1}
                          >
                            {msg.content}
                          </MessageBubble>
                        ))}
                      </div>
                      <div className="message-meta" style={{ textAlign: isMine ? 'right' : 'left' }}>
                        {group[0].senderName} • {new Date(group[group.length - 1].createdDate).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </MessageGroup>
                  );
                })}
            </MessageList>
            <InputArea>
              <Input
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                <FaPaperPlane />
              </Button>
            </InputArea>
          </>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#65676b',
            fontSize: '15px'
          }}>
            Select a chat or start a new conversation
          </div>
        )}
      </ChatArea>
    </Container>
  );
};

export default ChatPage;