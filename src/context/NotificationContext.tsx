import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import * as signalR from "@microsoft/signalr";

// Use the production API URL
const API_URL = 'https://api.apple-mart.capybara.pro.vn';
const HUB_URL = `${API_URL}/notificationHub`;

interface Notification {
    notificationID: number;
    header: string;
    content: string;
    isRead: boolean;
    createdDate: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (notificationId: number) => Promise<void>;
    deleteNotification: (notificationId: number) => Promise<void>;
    connectionState: string;
    testConnection: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [connectionState, setConnectionState] = useState<string>("Disconnected");
    const hubConnectionRef = useRef<signalR.HubConnection | null>(null);
    const connectionAttemptRef = useRef<boolean>(false);

    const handleReconnection = useCallback(async () => {
        if (hubConnectionRef.current?.state === "Disconnected") {
            connectionAttemptRef.current = false;
            await setupConnection();
        } else if (hubConnectionRef.current?.state === "Connected") {
            try {
                await hubConnectionRef.current.invoke("LoadNotifications");
            } catch (error) {
                console.error("Error reloading notifications:", error);
            }
        }
    }, []);

    const setupConnection = async () => {
        const token = localStorage.getItem("token");
        if (!token || connectionAttemptRef.current || (hubConnectionRef.current?.state === "Connected")) {
            return;
        }

        connectionAttemptRef.current = true;
        console.log("Setting up new SignalR connection...");

        try {
            console.log("Attempting to connect to:", HUB_URL);

            // Create a new connection with basic configuration
            const connection = new signalR.HubConnectionBuilder()
                .withUrl(HUB_URL, {
                    accessTokenFactory: () => token,
                    transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
                })
                .withAutomaticReconnect([0, 2000, 5000, 10000])
                .configureLogging(signalR.LogLevel.Information)
                .build();

            connection.on("ReceiveNotification", (notification: Notification) => {
                console.log("Received new notification:", notification);
                if (notification) {
                    setNotifications(prev => {
                        const exists = prev.some(n => n.notificationID === notification.notificationID);
                        if (!exists) {
                            const updatedNotifications = [notification, ...prev];
                            if (!notification.isRead) {
                                setUnreadCount(prevCount => prevCount + 1);
                            }
                            return updatedNotifications;
                        }
                        return prev;
                    });
                }
            });

            connection.on("LoadNotifications", (loadedNotifications: Notification[]) => {
                console.log("Loaded notifications:", loadedNotifications);
                if (Array.isArray(loadedNotifications)) {
                    setNotifications(loadedNotifications);
                    const count = loadedNotifications.filter(n => !n.isRead).length;
                    setUnreadCount(count);
                }
            });

            connection.on("NotificationRead", (notificationId: number) => {
                console.log("Notification marked as read:", notificationId);
                setNotifications(prev => {
                    const updatedNotifications = prev.map(n =>
                        n.notificationID === notificationId ? { ...n, isRead: true } : n
                    );
                    const newUnreadCount = updatedNotifications.filter(n => !n.isRead).length;
                    setUnreadCount(newUnreadCount);
                    return updatedNotifications;
                });
            });

            connection.on("NotificationDeleted", (notificationId: number) => {
                console.log("Notification deleted:", notificationId);
                setNotifications(prev => {
                    const notificationToDelete = prev.find(n => n.notificationID === notificationId);
                    const updatedNotifications = prev.filter(n => n.notificationID !== notificationId);
                    if (notificationToDelete && !notificationToDelete.isRead) {
                        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
                    }
                    return updatedNotifications;
                });
            });

            connection.onreconnecting(() => {
                console.log("Connection lost. Attempting to reconnect...");
                setConnectionState("Reconnecting");
            });

            connection.onreconnected(() => {
                console.log("Reconnected successfully");
                setConnectionState("Connected");
                connection.invoke("LoadNotifications").catch(console.error);
            });

            connection.onclose((error) => {
                console.log("Connection closed with error:", error);
                setConnectionState("Disconnected");
                hubConnectionRef.current = null;
                connectionAttemptRef.current = false;
                setTimeout(handleReconnection, 5000);
            });

            // Try to start the connection
            try {
                await connection.start();
                console.log("Connected to notification hub");
                setConnectionState("Connected");
                hubConnectionRef.current = connection;

                // Load initial notifications
                try {
                    await connection.invoke("LoadNotifications");
                    console.log("Successfully loaded notifications");
                } catch (error) {
                    console.error("Error loading initial notifications:", error);
                }
            } catch (error) {
                console.error("Error starting SignalR connection:", error);
                setConnectionState("Failed");
                connectionAttemptRef.current = false;
                setTimeout(handleReconnection, 5000);
            }
        } catch (error) {
            console.error("Error setting up SignalR connection:", error);
            setConnectionState("Failed");
            connectionAttemptRef.current = false;
            setTimeout(handleReconnection, 5000);
        }
    };

    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (document.visibilityState === 'visible') {
                console.log("Page became visible, checking connection...");

                if (!hubConnectionRef.current || hubConnectionRef.current.state !== "Connected") {
                    console.log("Connection not active, attempting to reconnect...");
                    connectionAttemptRef.current = false;
                    await setupConnection();
                } else {
                    try {
                        console.log("Connection active, reloading notifications...");
                        await hubConnectionRef.current.invoke("LoadNotifications");
                    } catch (error) {
                        console.error("Error reloading notifications:", error);
                        connectionAttemptRef.current = false;
                        await setupConnection();
                    }
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    useEffect(() => {
        console.log(`API URL is set to: ${API_URL}`);
        setupConnection();

        return () => {
            if (hubConnectionRef.current?.state === "Connected") {
                hubConnectionRef.current.stop();
                hubConnectionRef.current = null;
                connectionAttemptRef.current = false;
            }
        };
    }, []);

    useEffect(() => {
        const checkConnection = setInterval(() => {
            if (hubConnectionRef.current?.state !== "Connected") {
                console.log("Periodic connection check - attempting reconnection...");
                handleReconnection();
            }
        }, 30000);

        return () => clearInterval(checkConnection);
    }, [handleReconnection]);

    const markAsRead = async (notificationId: number) => {
        try {
            if (hubConnectionRef.current?.state === "Connected") {
                await hubConnectionRef.current.invoke("MarkAsRead", notificationId);
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const deleteNotification = async (notificationId: number) => {
        try {
            if (hubConnectionRef.current?.state === "Connected") {
                await hubConnectionRef.current.invoke("DeleteNotification", notificationId);
            }
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    const testConnection = async () => {
        try {
            if (!hubConnectionRef.current || hubConnectionRef.current.state !== "Connected") {
                console.log("Connection not active, attempting to reconnect...");
                connectionAttemptRef.current = false;
                await setupConnection();
            } else {
                console.log("Connection active, reloading notifications...");
                await hubConnectionRef.current.invoke("LoadNotifications");
            }
        } catch (error) {
            console.error("Error testing connection:", error);
        }
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                markAsRead,
                deleteNotification,
                connectionState,
                testConnection
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}; 