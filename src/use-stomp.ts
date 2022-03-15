import { useCallback, useState } from 'react';

import { Client, IMessage, StompConfig } from '@stomp/stompjs';

const useStomp = (
  callbacks?: {
    onConnect?: () => void,
    onDisconnect?: () => void,
    onWebSocketClose?: () => void
  }
) => {

  const [ client ] = useState<Client>(new Client());
  const [ connected, setConnected ] = useState<boolean>(false);

  const connect = useCallback((
    connectUrl: string,
    subscriptions?: { destination: string, onMessage: (message: IMessage) => void }[]
  ) => {
    const config: StompConfig = {
      brokerURL: connectUrl,
      onConnect: () => {
        console.log('Connected to WebSocket server');
        setConnected(true);
        callbacks?.onConnect && callbacks.onConnect();

        subscriptions?.forEach(subscription => {
          console.log(`Subscribing to '${subscription.destination}'`);
          client.subscribe(subscription.destination, subscription.onMessage);
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
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    };

    client.configure(config);
    client.activate();
  }, [
    callbacks,
    client
  ]);

  const sendMessage = useCallback((
    destination: string,
    message: string
  ) => {
    if (!connected) {
      console.warn('Attempted to send message before STOMP client was connected.')
      return;
    }

    client.publish({
      body: message,
      destination: destination
    })
  }, [
    client,
    connected
  ]);

  return {
    connect,
    connected,
    sendMessage
  };
};

export default useStomp;
