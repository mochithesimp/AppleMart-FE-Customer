import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import * as signalR from "@microsoft/signalr";

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
            const connection = new signalR.HubConnectionBuilder()
                .withUrl("https://localhost:7140/notificationHub", {
                    accessTokenFactory: () => token,
                    transport: signalR.HttpTransportType.WebSockets,
                    skipNegotiation: true
                })
                .withAutomaticReconnect([0, 2000, 5000, 10000, 20000])
                .configureLogging(signalR.LogLevel.Information)
                .build();

            connection.on("ReceiveNotification", (notification: Notification) => {
                console.log("Received new notification:", notification);
                if (notification) {
                    setNotifications(prev => {
                        const exists = prev.some(n => n.notificationID === notification.notificationID);
                        if (!exists) {
                            const updatedNotifications = [notification, ...prev];
                            console.log("Updated notifications array:", updatedNotifications);

                            if (!notification.isRead) {
                                setUnreadCount(prevCount => {
                                    const newCount = prevCount + 1;
                                    console.log("Immediately updating unread count to:", newCount);
                                    return newCount;
                                });
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
                    console.log("Setting unread count from loaded notifications:", count);
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

            connection.on("UpdateUnreadCount", (count: number) => {
                console.log("Server sent updated unread count:", count);
                setUnreadCount(count);
            });

            connection.onreconnecting(() => {
                console.log("Connection lost. Attempting to reconnect...");
                setConnectionState("Reconnecting");
            });

            connection.onreconnected(() => {
                console.log("Reconnected successfully");
                setConnectionState("Connected");
                // refresh lai noti
                connection.invoke("LoadNotifications").catch(console.error);
            });

            connection.onclose(() => {
                console.log("Connection closed");
                setConnectionState("Disconnected");
                hubConnectionRef.current = null;
                connectionAttemptRef.current = false;
                // ket noi lai tranh timeout
                setTimeout(handleReconnection, 5000);
            });

            await connection.start();
            console.log("Connected to notification hub");
            setConnectionState("Connected");
            hubConnectionRef.current = connection;


        } catch (error) {
            console.error("Error setting up SignalR connection:", error);
            setConnectionState("Failed");
            connectionAttemptRef.current = false;

            if (hubConnectionRef.current) {
                try {
                    await hubConnectionRef.current.stop();
                } catch (stopError) {
                    console.error("Error stopping failed connection:", stopError);
                }
                hubConnectionRef.current = null;
            }

            // ket noi lai tranh timeout
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

    useEffect(() => {
        console.log("SignalR Connection State:", connectionState);
    }, [connectionState]);

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
        if (hubConnectionRef.current?.state === "Connected") {
            console.log("Testing SignalR connection...");
            try {
                await hubConnectionRef.current.invoke("Echo", "Test message");
                console.log("SignalR connection test successful");
            } catch (error) {
                console.error("SignalR connection test failed:", error);
            }
        } else {
            console.log("Not connected to SignalR hub");
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
                testConnection,
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