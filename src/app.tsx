import React, { useState } from 'react';
import useWebSocket from 'react-use-websocket';

const App = () => {

  const [ messages, setMessages ] = useState<string>('');

  const { sendMessage } = useWebSocket('ws://localhost:10101/socket', {
    onError: (e) => console.error(e),
    onMessage: (e) => setMessages(messages + e?.data),
    onOpen: (e) => console.log(e)
  });

  return (
    <div className='App'>
      <div>{messages}</div>
      <button onClick={() => sendMessage('Hello')}>Send</button>
    </div>
  );
}

export default App;
