import { Contract, BigNumberish, Wallet, TransactionResponse } from "ethers";

// Function to get the token vault contract instance
export const getTokenVaultContract = (address: string, abi: any, signer: Wallet) => {
  return new Contract(address, abi, signer);
};

// Fetches the allowance of tokens
export const getAllowance = async (
  token: Contract,
  owner: string,
  spender: string
): Promise<BigNumberish> => {
  try {
    return await token.allowance(owner, spender);
  } catch (error) {
    console.error("Failed to fetch allowance:", error);
    throw error;
  }
};

// Approves a spender to use a specific amount of tokens
export const approveToken = async (
  token: Contract,
  spender: string,
  amount: BigNumberish
): Promise<TransactionResponse> => {
  try {
    const tx = await token.approve(spender, amount);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Failed to approve tokens:", error);
    throw error;
  }
};

// Deposits tokens into a vault
export const depositTokens = async (
  vault: Contract,
  amount: BigNumberish
): Promise<TransactionResponse> => {
  try {
    const tx = await vault.deposit(amount);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Failed to deposit tokens:", error);
    throw error;
  }
};

// Fetches the token balance of a given address
export const getBalance = async (vault: Contract, address: string): Promise<BigNumberish> => {
  try {
    return await vault.balanceOf(address);
  } catch (error) {
    console.error("Failed to fetch balance:", error);
    throw error;
  }
};
