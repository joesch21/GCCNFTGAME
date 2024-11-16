import Onboard from '@web3-onboard/core';
import metamaskModule from '@web3-onboard/metamask';

// MetaMask Module
const metamask = metamaskModule({
  options: {
    dappMetadata: {
      name: 'Gold Condor Capital Game',
    },
  },
});

// Onboard Initialization
const onboard = Onboard({
  wallets: [metamask],
  chains: [
    {
      id: '0x61', // BSC Testnet Chain ID
      token: 'tBNB',
      label: 'Binance Smart Chain Testnet',
      rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    },
  ],
  appMetadata: {
    name: 'Gold Condor Capital Game',
    description: 'Play slots and win with GCC!',
    icon: 'condortransparent.png', // Add your app icon if applicable
  },
});

export default onboard;
