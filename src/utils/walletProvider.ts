import Onboard from '@web3-onboard/core';
import metamaskModule from '@web3-onboard/metamask';

const metamask = metamaskModule({
  options: {
    dappMetadata: {
      name: 'Gold Condor Capital Game',
    },
  },
});

const onboard = Onboard({
  wallets: [metamask],
  chains: [
    {
      id: '0x61', // BSC Testnet Chain ID
      token: 'tBNB', // Testnet BNB token
      label: 'Binance Smart Chain Testnet',
      rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    },
  ],
});

export default onboard;
