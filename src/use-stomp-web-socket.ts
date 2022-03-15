import { useCallback, useState } from 'react';

import { Client, IMessage, StompConfig } from '@stomp/stompjs';

interface StompClientOptions {
  callbacks?: {
    onConnect?: () => void;
    onDisconnect?: () => void;
    onWebSocketClose?: () => void;
  },
  timings?: {
    connectionTimeout?: number;
    heartbeatIncoming?: number;
    heartbeatOutgoing?: number;
    reconnectDelay?: number;
  }
}

interface StompSubscription {
  destination: string;
  onMessage: (message: IMessage) => void;
}

const useStompWebSocket = (options?: StompClientOptions) => {

  const [ connected, setConnected ] = useState<boolean>(false);
  const [ stompClient ] = useState<Client>(new Client());

  const connect = useCallback((connectUrl: string, subscriptions?: StompSubscription[]) => {

    const callbacks = options?.callbacks;
    const timings = options?.timings;

    const config: StompConfig = {
      brokerURL: connectUrl,
      connectionTimeout: timings?.connectionTimeout || 1000,
      heartbeatIncoming: timings?.heartbeatIncoming || 4000,
      heartbeatOutgoing: timings?.heartbeatOutgoing || 4000,
      reconnectDelay: timings?.reconnectDelay || 5000,
      onConnect: () => {
        console.log('Connected to WebSocket server');
        setConnected(true);
        callbacks?.onConnect && callbacks.onConnect();

        subscriptions?.forEach(subscription => {
          console.log(`Subscribing to '${subscription.destination}'`);
          stompClient.subscribe(subscription.destination, subscription.onMessage);
        });
      },
      onDisconnect: () => {
        console.warn('Disconnected to WebSocket server');
        setConnected(false);
        callbacks?.onDisconnect && callbacks.onDisconnect();
      },
      onWebSocketClose: () => {
        console.warn('WebSocket closed');
        setConnected(false);
        callbacks?.onWebSocketClose && callbacks.onWebSocketClose();
      }
    };

    stompClient.configure(config);
    stompClient.activate();
  }, [
    options,
    stompClient
  ]);

  const sendMessage = useCallback((
    destination: string,
    message: string
  ) => {
    if (!connected) {
      console.warn('Attempted to send message before STOMP stompClient was connected.')
      return;
    }

    stompClient.publish({
      body: message,
      destination: destination
    })
  }, [
    connected,
    stompClient
  ]);

  return {
    connect,
    connected,
    sendMessage
  };
};

export default useStompWebSocket;
