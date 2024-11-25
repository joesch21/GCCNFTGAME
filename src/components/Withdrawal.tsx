import React, { useState } from 'react';
import { ethers } from 'ethers';
import WithdrawWinningsABI from '../contracts/WithdrawWinningsABI.json';

interface WithdrawalProps {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
}

const Withdrawal: React.FC<WithdrawalProps> = ({ provider, signer }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const withdrawWinnings = async () => {
    if (!signer) {
      alert('Please connect your wallet.');
      return;
    }

    try {
      setIsProcessing(true);

      const CONTRACT_ADDRESS = '0x687B9805EA0E42c6029F82ed7fae07F7E33c02f3'; // Replace with your contract address

      // Create a contract instance
      const withdrawWinningsContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        WithdrawWinningsABI,
        signer
      );

      // Call the withdrawWinnings function
      const tx = await withdrawWinningsContract.withdrawWinnings();
      console.log('Transaction sent:', tx.hash);

      await tx.wait(); // Wait for the transaction to be mined
      alert('Winnings withdrawn successfully!');
    } catch (error) {
      console.error('Error withdrawing winnings:', error);
      alert('Failed to withdraw winnings.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={withdrawWinnings}
      disabled={isProcessing}
      style={{
        padding: '10px 20px',
        backgroundColor: isProcessing ? '#ccc' : '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: isProcessing ? 'not-allowed' : 'pointer',
        fontSize: '1em',
        margin: '10px 0',
      }}
    >
      {isProcessing ? 'Processing...' : 'Withdraw Winnings'}
    </button>
  );
};

export default Withdrawal;
