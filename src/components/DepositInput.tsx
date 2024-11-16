import React from 'react';

interface DepositInputProps {
  depositAmount: number;
  setDepositAmount: (amount: number) => void;
}

const DepositInput: React.FC<DepositInputProps> = ({ depositAmount, setDepositAmount }) => {
  return (
    <div>
      <label htmlFor="depositAmount" style={{ marginRight: '10px' }}>
        Enter Deposit Amount:
      </label>
      <input
        type="number"
        id="depositAmount"
        value={depositAmount}
        onChange={(e) => setDepositAmount(Number(e.target.value))}
        style={{
          padding: '5px',
          borderRadius: '5px',
          border: '1px solid #28d850',
          marginBottom: '10px',
        }}
      />
    </div>
  );
};

export default DepositInput;
