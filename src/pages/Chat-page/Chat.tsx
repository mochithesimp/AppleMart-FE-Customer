import React, { useEffect, useRef, useState } from 'react';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';
import axios from 'axios';
import styled from 'styled-components';
import { ChatRoom, Message, User, StyledProps, ApiResponse } from '../../interfaces/index';
import { FaPlus, FaUsers, FaPaperPlane, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import * as signalR from '@microsoft/signalr';

// Replace localhost with the deployed API URL
const API_BASE_URL = 'https://api.apple-mart.capybara.pro.vn';
// API endpoints (with /api) for REST calls
const API_ENDPOINT = `${API_BASE_URL}/api`;
// Hub endpoint (without /api) for SignalR
const CHAT_HUB_URL = `${API_BASE_URL}/chatHub`;

const unwrapValues = <T,>(data: T[] | { $values: T[] } | undefined): T[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.$values || [];
};

const USERS_PER_PAGE = 2;

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
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
`;

const NavigationButton = styled.button`
  background: #ffffff;
  border: 1px solid #e4e6eb;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: #f5f6f7;
    transform: scale(1.05);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const UsersContainer = styled.div`
  display: flex;
  gap: 8px;
  transition: transform 0.3s ease;
  min-width: ${USERS_PER_PAGE * 48}px;
  justify-content: flex-start;
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
  align-items: ${props => props.isMine ? 'flex-end' : 'flex-start'};
  margin: 4px 0;
  width: 100%;

  .messages {
    display: flex;
    flex-direction: column;
    gap: 2px;
    align-items: ${props => props.isMine ? 'flex-end' : 'flex-start'};
  }

  .message-meta {
    font-size: 12px;
    color: #65676b;
    margin-top: 4px;
    padding: 0 12px;
  }
`;

const MessageBubble = styled.div<StyledProps>`
  padding: 8px 12px;
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
  display: inline-block;
  background: ${props => props.isMine ? '#0084ff' : '#e4e6eb'};
  color: ${props => props.isMine ? '#ffffff' : '#050505'};
  border-radius: 18px;

  & + & {
    margin-top: 1px;
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
  const [userOffset, setUserOffset] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.defaults.baseURL = API_ENDPOINT;

    loadRooms().catch(error => {
      console.error('Error in initial room load:', error);
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.defaults.baseURL = API_ENDPOINT;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const setupChatConnection = () => {
      console.log(`Setting up chat hub connection to ${CHAT_HUB_URL}...`);

      const newConnection = new HubConnectionBuilder()
        .withUrl(CHAT_HUB_URL, {
          accessTokenFactory: () => token,
          // Use both WebSockets and LongPolling to ensure connection
          transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
          // Important: Do not skip negotiation
          skipNegotiation: false
        })
        .withAutomaticReconnect([0, 1000, 5000, 10000, 15000])
        .configureLogging(signalR.LogLevel.Information)
        .build();

      // Set the connection and try to start it
      setConnection(newConnection);
    };

    setupChatConnection();

    return () => {
      if (connection && connection.state === 'Connected') {
        connection.stop().catch(console.error);
      }
    };
  }, []);

  useEffect(() => {
    if (!connection) return;

    const startConnection = async () => {
      try {
        console.log('Starting SignalR connection to:', CHAT_HUB_URL);
        await connection.start();
        console.log('Connected to SignalR Hub successfully');

        // Add improved error handling for connection events
        connection.onreconnecting(error => {
          console.log('SignalR reconnecting due to error:', error);
        });

        connection.onreconnected(connectionId => {
          console.log('SignalR reconnected with connectionId:', connectionId);
          // Reload data after reconnection
          loadRooms().catch(error => console.error('Error reloading rooms after reconnection:', error));
          loadOnlineUsers().catch(error => console.error('Error reloading users after reconnection:', error));
        });

        connection.onclose(error => {
          console.log('SignalR connection closed:', error);
          // Attempt to reconnect after a timeout
          setTimeout(() => {
            if (connection.state !== 'Connected') {
              console.log('Attempting to reconnect after connection closed...');
              startConnection().catch(console.error);
            }
          }, 5000);
        });

        // Register event handlers
        connection.on('ReceiveMessage', (message: Message) => {
          console.log('Received message:', message);

          setRooms(prev =>
            prev.map(room => {
              if (room.chatRoomID === message.chatRoomID) {
                const updatedMessages = Array.isArray(room.messages)
                  ? [...room.messages, message]
                  : [...(room.messages?.$values || []), message];

                return {
                  ...room,
                  messages: updatedMessages,
                  lastMessage: message
                };
              }
              return room;
            })
          );

          setActiveRoom(prev => {
            if (prev && prev.chatRoomID === message.chatRoomID) {
              const updatedMessages = Array.isArray(prev.messages)
                ? [...prev.messages, message]
                : [...(prev.messages?.$values || []), message];

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
              user.userID === userId ? { ...user, isOnline: true } : user
            )
          );

          setRooms(prev => prev.map(room => ({
            ...room,
            participants: Array.isArray(room.participants)
              ? room.participants.map(p =>
                p.userID === userId ? { ...p, isOnline: true } : p
              )
              : room.participants?.$values.map(p =>
                p.userID === userId ? { ...p, isOnline: true } : p
              )
          })));
        });

        connection.on('UserOffline', (userId: string) => {
          console.log('User went offline:', userId);
          setOnlineUsers(prev =>
            prev.map(user =>
              user.userID === userId ? { ...user, isOnline: false } : user
            )
          );

          setRooms(prev => prev.map(room => ({
            ...room,
            participants: Array.isArray(room.participants)
              ? room.participants.map(p =>
                p.userID === userId ? { ...p, isOnline: false } : p
              )
              : room.participants?.$values.map(p =>
                p.userID === userId ? { ...p, isOnline: false } : p
              )
          })));
        });

        // Load data after connection is established
        await loadRooms();
        await loadOnlineUsers();
      } catch (error) {
        console.error('SignalR connection failed:', error);
        // Try to reconnect after a delay
        setTimeout(() => {
          if (connection.state !== 'Connected') {
            console.log('Attempting to reconnect after failure...');
            startConnection();
          }
        }, 5000);
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
      const response = await axios.get<ApiResponse<ChatRoom>>('/chat/rooms');
      console.log('Chat rooms response:', response.data);

      const roomsData: ChatRoom[] = (response.data.$values || response.data || []) as ChatRoom[];
      const rooms: ChatRoom[] = roomsData.map((room: ChatRoom) => ({
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
      const response = await axios.get<ApiResponse<User>>('/chat/users/online');
      console.log('Online users:', response.data);
      const users: User[] = (response.data.$values || response.data || []) as User[];

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        setOnlineUsers([]);
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentUserId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
        console.log('Current user ID:', currentUserId);

        const filteredUsers = users.filter(user => user.userID !== currentUserId);
        console.log('Filtered users (excluding current user):', filteredUsers);

        setOnlineUsers(filteredUsers);
      } catch (error) {
        console.error('Error parsing token:', error);
        setOnlineUsers([]);
      }
    } catch (error) {
      console.error('Failed to load online users:', error);
      setOnlineUsers([]);
    }
  };

  const handleUserClick = async (userId: string) => {
    try {
      console.log('Creating chat with user:', userId);
      const response = await axios.post<ChatRoom>('/chat/room/private',
        { otherUserId: userId },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Chat room created:', response.data);
      if (response.data) {
        const newRoom = {
          ...response.data,
          participants: unwrapValues(response.data.participants),
          messages: unwrapValues(response.data.messages)
        };

        setRooms(prev => {
          const exists = prev.some(room => room.chatRoomID === newRoom.chatRoomID);
          if (exists) {
            handleRoomClick(newRoom);
            return prev;
          }
          return [...prev, newRoom];
        });
        setActiveRoom(newRoom);
        if (connection) {
          await connection.invoke('JoinRoom', newRoom.chatRoomID);
        }
      }
    } catch (error) {
      console.error('Failed to create chat room:', error);
      if (axios.isAxiosError(error) && error.response?.data) {
        console.error('Error details:', error.response.data);
        console.log('Full error response:', error.response);
      }
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

      const response = await axios.get<ChatRoom>(`/chat/room/${room.chatRoomID}`);
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

  const visibleUsers = onlineUsers.slice(userOffset, userOffset + USERS_PER_PAGE);
  const canScrollLeft = userOffset > 0;
  const canScrollRight = userOffset + USERS_PER_PAGE < onlineUsers.length;

  const handleScrollLeft = () => {
    setUserOffset(prev => Math.max(0, prev - USERS_PER_PAGE));
  };

  const handleScrollRight = () => {
    setUserOffset(prev => Math.min(onlineUsers.length - USERS_PER_PAGE, prev + USERS_PER_PAGE));
  };

  const getCurrentUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
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
          {canScrollLeft && (
            <NavigationButton
              onClick={handleScrollLeft}
              title={`Show previous ${USERS_PER_PAGE} users (${userOffset} previous)`}
            >
              <FaChevronLeft />
            </NavigationButton>
          )}
          <UsersContainer>
            {visibleUsers.map(user => (
              <UserAvatar
                key={user.userID}
                isOnline={user.isOnline}
                onClick={() => handleUserClick(user.userID)}
                title={user.userName}
              >
                {user.userName?.[0]?.toUpperCase()}
              </UserAvatar>
            ))}
          </UsersContainer>
          {canScrollRight && (
            <NavigationButton
              onClick={handleScrollRight}
              title={`Show next ${USERS_PER_PAGE} users (${onlineUsers.length - (userOffset + USERS_PER_PAGE)} remaining)`}
            >
              <FaChevronRight />
            </NavigationButton>
          )}
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
                    ? `${(Array.isArray(activeRoom.participants)
                      ? activeRoom.participants.length
                      : activeRoom.participants?.$values?.length) || 0} members`
                    : (Array.isArray(activeRoom.participants)
                      ? activeRoom.participants.some(p => p.isOnline)
                      : activeRoom.participants?.$values?.some(p => p.isOnline))
                      ? 'Active now'
                      : 'Offline'}
                </small>
              </div>
            </ChatHeader>

            <MessageList ref={messageListRef}>
              {(Array.isArray(activeRoom?.messages) ? activeRoom.messages : activeRoom?.messages?.$values || [])
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
                  const currentUserId = getCurrentUserIdFromToken();
                  const isMine = group[0].senderID === currentUserId;
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
                      <div className="message-meta">
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