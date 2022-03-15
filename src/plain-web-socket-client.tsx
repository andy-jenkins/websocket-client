import React, { useState } from 'react';

import useWebSocket from 'react-use-websocket';

const PlainWebSocketClient = () => {

  const [ messages, setMessages ] = useState<string>('');

  const reconnectAttempts = 10;
  const reconnectIntervalMilliseconds = 10000;

  const getStateDescription = (readyState: -1 | 0 | 1 | 2 | 3) => {

    switch (readyState) {
      case -1:
        return 'Uninstantiated';
      case 0:
        return 'Connecting';
      case 1:
        return 'Open';
      case 2:
        return 'Closing';
      case 3:
        return 'Closed';
      default:
        return 'Unknown';
    }
  };

  const onClose = (event: CloseEvent) => {
    console.log('Received close event');
    console.log(event);
  };

  const onError = (event: Event) => {
    console.log('Received error event');
    console.log(event);
  };

  const onMessage = (event: MessageEvent) => {
    console.log('Received message event');
    console.log(event);
    setMessages(messages + event?.data);
  };

  const onOpen = (event: Event) => {
    console.log('Received open event');
    console.log(event);
  };

  const onReconnectStop = (attempts: number) => {
    console.warn(`Reconnect attempted ${attempts} times, reconnect will not be attempted again`);
  };

  const send = (message: string) => {
    console.log('Sending message...');
    sendMessage(message);
  };

  const { readyState, sendMessage } = useWebSocket('ws://localhost:10101/socket', {
    onClose: onClose,
    onError: onError,
    onMessage: onMessage,
    onOpen: onOpen,
    onReconnectStop: onReconnectStop,
    shouldReconnect: (event: CloseEvent) => true,
    reconnectAttempts: reconnectAttempts,
    reconnectInterval: reconnectIntervalMilliseconds
  });

  return (
    <div>
      {getStateDescription(readyState)}
      <div>{messages}</div>
      <button onClick={() => send('Hello')}>Send</button>
    </div>
  );
}

export default PlainWebSocketClient;
