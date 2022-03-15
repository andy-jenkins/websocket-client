import React from 'react';

import StompWebSocketClient from './stomp-web-socket-client';

const App = () => {

  return (
    <div className='App'>
      {/*<PlainWebSocketClient />*/}
      <StompWebSocketClient />
    </div>
  );
}

export default App;
