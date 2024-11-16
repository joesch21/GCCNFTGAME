import React, { useState } from "react";
import SlotMachine from "./components/SlotMachine";
import "./App.css";
import navbarBackground from "./assets/condortransparent.png";
import onboard from "./utils/walletProvider"; // Import walletProvider

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
      await onboard.disconnectWallet({ label: "MetaMask" });
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
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="title">Gold Condor Capital</h1>
        <nav>
          <ul>
            <li>
              <button
                onClick={connectedAccount ? disconnectWallet : connectWallet}
                style={{
                  background: connectedAccount
                    ? "linear-gradient(45deg, #ff4d4d, #8b0000)" // Red for connected
                    : "linear-gradient(45deg, #28d850, #ffdd44)", // Green for default
                  color: "#fff",
                  border: connectedAccount
                    ? "2px solid #ff4d4d"
                    : "2px solid #28d850",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontSize: "1em",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "transform 0.2s, background 0.2s",
                  margin: "5px",
                  maxWidth: "90%",
                }}
              >
                {connectedAccount ? "Connected" : "Connect Wallet"}
              </button>
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
