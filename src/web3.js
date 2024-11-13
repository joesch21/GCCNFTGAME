// src/web3.js
import { ethers } from 'ethers';

// Connect to Metamask
export async function connectWallet() {
  if (window.ethereum) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return { provider, signer };
  } else {
    console.log('Metamask is not installed');
    return null;
  }
}
