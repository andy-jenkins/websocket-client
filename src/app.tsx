import React from 'react';

import PlainWebSocketClient from './plain-web-socket-client';
import StompWebSocketClient from './stomp-web-socket-client';

const App = () => {

  return (
    <div className='App'>
      <PlainWebSocketClient />
      <StompWebSocketClient />
    </div>
  );
}

export default App;
