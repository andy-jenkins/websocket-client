import React from 'react';
import useWebSocket from 'react-use-websocket';

const App = () => {

  const { readyState } = useWebSocket('ws://localhost:10101/user', {
    onError: (e) => console.error(e)
  });

  console.log(readyState);

  return (
    <div className='App'>
      Hello
    </div>
  );
}

export default App;
