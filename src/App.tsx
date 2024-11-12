// App.tsx
import React from 'react';
import Slots from './components/Slots';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <h1 className="title">Slot Machine Game</h1>
      <Slots /> {/* This renders the main slot machine */}
    </div>
  );
};

export default App;
