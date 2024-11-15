import React, { useState } from 'react';
import SlotMachine from './components/SlotMachine';
import './App.css';
import navbarBackground from './assets/condortransparent.png';

import Onboard from '@web3-onboard/core';
import metamaskModule from '@web3-onboard/metamask';

// Initialize MetaMask module with dapp metadata
const metamask = metamaskModule({
  options: {
    dappMetadata: {
      name: 'Gold Condor Capital Game',
    },
  },
});

// Initialize Onboard with MetaMask and chain info
const onboard = Onboard({
  wallets: [metamask],
  chains: [
    {
      id: '0x1', // Mainnet chain ID
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`, // Use env variable
    },
  ],
});

const App: React.FC = () => {
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);

  // Function to connect to MetaMask using Web3-Onboard
  const connectWallet = async () => {
    const wallets = await onboard.connectWallet();
    if (wallets && wallets.length > 0) {
      const account = wallets[0].accounts[0].address;
      setConnectedAccount(account);
      console.log("Wallet connected:", account);
    }
  };

  // Function to disconnect from MetaMask using Web3-Onboard
  const disconnectWallet = async () => {
    if (connectedAccount) {
      await onboard.disconnectWallet({ label: 'MetaMask' });
      setConnectedAccount(null);
      console.log("Wallet disconnected");
    }
  };

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
            <li>
              <button onClick={connectWallet}>
                {connectedAccount ? 'Connected' : 'Connect Wallet'}
              </button>
            </li>
            <li>
              {connectedAccount && (
                <button onClick={disconnectWallet}>Disconnect Wallet</button>
              )}
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <h2 className="subtitle">Glimp GCC Game</h2>
        <SlotMachine account={connectedAccount} />
      </main>
      <footer>
        <p>Enjoy playing! Good luck!</p>
      </footer>
    </div>
  );
};

export default App;
