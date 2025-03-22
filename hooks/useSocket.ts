import { useEffect } from "react";
import useWebSocket from "react-use-websocket";

interface UseSocketOptions {
  url: string;
  channel: string;
  onMessage: (data: any) => void;
  shouldReconnect?: () => boolean;
}

export function useSocket({
  url,
  channel,
  onMessage,
  shouldReconnect,
}: UseSocketOptions) {
  const { sendJsonMessage } = useWebSocket(url, {
    onOpen: () => {
      console.log(`WebSocket connected to ${url}`);
      sendJsonMessage({ type: "subscribe", channel });
    },
    onMessage: (event) => {
      const message = JSON.parse(event.data);
      if (message.channel === channel) {
        console.log(`Received update for ${channel}:`, message.data);
        onMessage(message.data);
      }
    },
    onClose: () => {
      console.log(`WebSocket disconnected from ${url}`);
    },
    shouldReconnect,
  });

  useEffect(() => {
    return () => {
      sendJsonMessage({ type: "unsubscribe", channel });
    };
  }, [sendJsonMessage, channel]);

  return { sendJsonMessage };
}
