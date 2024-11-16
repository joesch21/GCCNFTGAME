import { ethers } from 'ethers';

export const getTokenVaultContract = (address: string, abi: any, signer: ethers.Signer) => {
  return new ethers.Contract(address, abi, signer);
};

export const getAllowance = async (token: ethers.Contract, owner: string, spender: string) => {
  return await token.allowance(owner, spender);
};

export const approveToken = async (token: ethers.Contract, spender: string, amount: ethers.BigNumber) => {
  const tx = await token.approve(spender, amount);
  await tx.wait();
  return tx;
};

export const depositTokens = async (vault: ethers.Contract, amount: ethers.BigNumber) => {
  const tx = await vault.deposit(amount);
  await tx.wait();
  return tx;
};

export const getBalance = async (vault: ethers.Contract, address: string) => {
  return await vault.balances(address);
};
