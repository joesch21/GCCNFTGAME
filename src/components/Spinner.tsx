import React from 'react';

interface SpinnerProps {
  message: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message }) => {
  return (
    <div className="spinner-overlay">
      <div className="loader" />
      <p>{message}</p>
    </div>
  );
};

export default Spinner;
