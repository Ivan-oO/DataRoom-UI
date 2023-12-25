import React, { useState } from 'react';
import './SecurityCheck.css';

function SecurityCheck({ onClose, onCodeSubmit }) {
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code === '30') { // This is a placeholder check
      onClose();
    } else {
      alert('Incorrect code');
    }
  };

  return (
    <div className="security-check-overlay">
      <div className="security-check-window">
        <form onSubmit={handleSubmit}>
          <p>Enter TOTP Code:</p>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default SecurityCheck;
