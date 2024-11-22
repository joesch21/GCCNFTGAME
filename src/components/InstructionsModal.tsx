import React from "react";

// Define the props type
interface InstructionsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null; // Render nothing if not visible

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#fff",
        padding: "20px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
      }}
    >
      <h2>How to Play</h2>
      <ol>
        <li>Connect your wallet by clicking "Connect Wallet".</li>
        <li>Make sure you have Test BNB in your wallet.</li>
        <li>Claim your GCCT tokens by clicking "Claim Tokens".</li>
        <li>Deposit GCCT tokens and start playing the game!</li>
      </ol>
      <button
        onClick={onClose}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          backgroundColor: "#f0ad4e",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Close
      </button>
    </div>
  );
};

export default InstructionsModal;
