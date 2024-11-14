import React from 'react';
import SlotMachine from './components/SlotMachine';
import './App.css';
import navbarBackground from './assets/condortransparent.png';

const App: React.FC = () => {
  return (
    <div className="app">
      <header
        className="navbar"
        style={{
          backgroundImage: `url(${navbarBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h1 className="title">Gold Condor Capital</h1>
        <nav>
          <ul>
            
          </ul>
        </nav>
      </header>
      <main>
        <h2 className="subtitle">Glimp GCC Game</h2>
        <SlotMachine />
      </main>
      <footer>
        <p>Enjoy playing! Good luck!</p>
      </footer>
    </div>
  );
};

export default App;
