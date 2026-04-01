import { Client, type Frame, type Message } from "@stomp/stompjs";

export interface ChatMessage {
  id: number;
  matchId: number;
  sender: string;
  content: string;
  timestamp: string;
  status: string;
}

let stompClient: Client | null = null;

const WS_URL = "ws://localhost:8080/ws";

type MessageCallback = (body: ChatMessage) => void;

const subscriptions: Map<string, () => void> = new Map();

export const connect = (
  onConnected: () => void,
  onError: (error: Frame) => void,
): void => {
  stompClient = new Client({
    webSocketFactory: () => new WebSocket(WS_URL),
    connectHeaders: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    onConnect: () => {
      onConnected();
    },
    onStompError: (frame: Frame) => {
      onError(frame);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.activate();
};

export const subscribe = (
  destination: string,
  callback: MessageCallback,
): (() => void) => {
  if (!stompClient || !stompClient.connected) {
    console.error("STOMP client not connected");
    return () => {};
  }

  const subscription = stompClient.subscribe(
    destination,
    (message: Message) => {
      const body = JSON.parse(message.body) as ChatMessage;
      callback(body);
    },
  );

  const unsubscribe = () => {
    subscription.unsubscribe();
  };

  subscriptions.set(destination, unsubscribe);

  return unsubscribe;
};

export const sendMessage = (destination: string, body: object): void => {
  if (!stompClient || !stompClient.connected) {
    console.error("STOMP client not connected");
    return;
  }

  stompClient.publish({
    destination,
    body: JSON.stringify(body),
  });
};

export const disconnect = (): void => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};

export const isConnected = (): boolean => stompClient?.connected ?? false;
