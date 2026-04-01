import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/api";
import { connect, subscribe, sendMessage, disconnect } from "../api/socket";
import type { ChatMessage } from "../api/socket";
import LoadingSpinner from "../components/LoadingSpinner";

function Chat() {
    const { matchId } = useParams<{ matchId: string }>();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [inputValue, setInputValue] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const currentUser = localStorage.getItem("userEmail") || "unknown";

    useEffect(() => {
        if (!matchId) return;

        api
            .get(`/messages/${matchId}`)
            .then((res) => {
                setMessages(res.data)
                setIsLoadingMessages(false)
            })
            .catch((err) => {
                console.error("Failed to load messages:", err)
                setIsLoadingMessages(false)
            });
    }, [matchId]);

    useEffect(() => {
        if (!matchId) return;

        connect(
            () => {
                setIsConnected(true);

                subscribe(`/topic/messages/${matchId}`, (newMessage) => {
                    setMessages((prev) => [...prev, newMessage]);
                });
            },
            (error) => {
                console.error("WebSocket error:", error);
                setIsConnected(false);
            }
        );

        return () => {
            disconnect();
        };
    }, [matchId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim() || !matchId) return;

        const message = {
            matchId: parseInt(matchId),
            sender: currentUser,
            content: inputValue.trim(),
        };

        sendMessage(`/app/chat.sendMessage/${matchId}`, message);
        setInputValue("");
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    return (
        <div style={styles.container}>
            <Navbar />

            <div style={styles.chatContainer}>
                <div style={styles.header}>
                    <h2>Chat</h2>
                    <span style={styles.status}>
                        {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
                    </span>
                </div>

                <div style={styles.messagesList}>
                    {isLoadingMessages ? (
                        <LoadingSpinner />
                    ) : messages.length === 0 ? (
                        <div style={styles.emptyContainer}>
                            <p style={styles.emptyText}>No messages yet</p>
                            <p style={styles.emptySubtext}>Say hello! 👋</p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                style={{
                                    ...styles.message,
                                    ...(msg.sender === currentUser
                                        ? styles.sentMessage
                                        : styles.receivedMessage),
                                }}
                            >
                                <div style={styles.messageContent}>{msg.content}</div>
                                <div style={styles.messageTime}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div style={styles.inputContainer}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        style={styles.input}
                    />
                    <button
                        onClick={handleSend}
                        style={styles.sendButton}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#0066cc"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0084ff"}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
    },
    chatContainer: {
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },
    status: {
        fontSize: "0.9rem",
        color: "#666",
    },
    messagesList: {
        height: "calc(100vh - 200px)",
        overflowY: "auto",
        padding: "10px",
    },
    emptyContainer: {
        textAlign: "center",
        padding: "40px 20px",
    },
    emptyText: {
        fontSize: "1.1rem",
        color: "#333",
        margin: "0 0 8px 0",
    },
    emptySubtext: {
        color: "#666",
        margin: 0,
    },
    message: {
        maxWidth: "70%",
        padding: "10px 14px",
        borderRadius: "16px",
        marginBottom: "10px",
    },
    sentMessage: {
        backgroundColor: "#0084ff",
        color: "white",
        alignSelf: "flex-end",
        marginLeft: "auto",
    },
    receivedMessage: {
        backgroundColor: "#e4e6eb",
        color: "black",
    },
    messageContent: {
        wordBreak: "break-word",
    },
    messageTime: {
        fontSize: "0.7rem",
        opacity: 0.7,
        marginTop: "4px",
        textAlign: "right",
    },
    inputContainer: {
        display: "flex",
        gap: "10px",
        padding: "10px",
        backgroundColor: "white",
        borderRadius: "24px",
        marginTop: "10px",
    },
    input: {
        flex: 1,
        border: "none",
        outline: "none",
        padding: "10px",
        fontSize: "1rem",
    },
    sendButton: {
        padding: "10px 20px",
        backgroundColor: "#0084ff",
        color: "white",
        border: "none",
        borderRadius: "20px",
        cursor: "pointer",
    },
};

export default Chat;