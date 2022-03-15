import React, { useEffect } from 'react';

import { IMessage } from '@stomp/stompjs';

import useStompWebSocket from './use-stomp-web-socket';

const StompWebSocketClient = () => {

  const { connect, connected, sendMessage } = useStompWebSocket({
    callbacks: {
      onConnect: () => console.log('Custom connect logging...')
    }
  });

  const onMessage = (message: IMessage) => {
    console.log(`Received message: ${message.body}`);
  };

  const send = (message: string) => {
    console.log(`Sending message: ${message}`);
    sendMessage('/consume/greeting', message);
  };

  useEffect(() => {
    if (connected) {
      return;
    }

    const subscriptions = [
      {
        destination: '/broadcast/greeting',
        onMessage: onMessage
      }
    ];

    connect('ws://localhost:10101/socket', subscriptions);
  }, [
    connect,
    connected
  ]);

  return (
    <div>
      Connected: {connected ? 'Yes' : 'No'}
      <button onClick={() => send('Hello')}>Send</button>
    </div>
  );
}

export default StompWebSocketClient;
