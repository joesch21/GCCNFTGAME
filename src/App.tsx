import React from 'react';
import SlotMachine from './components/SlotMachine';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="navbar">
        <h1 className="title">Gold Condor Capital</h1>
        <nav>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#game">Game</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
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
