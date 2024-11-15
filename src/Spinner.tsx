// Spinner.tsx
import React from 'react';

interface SpinnerProps {
  message?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message }) => (
  <div className="spinner">
    <div className="loader"></div>
    {message && <p>{message}</p>}
  </div>
);

export default Spinner;
