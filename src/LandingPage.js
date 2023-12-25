import React, { useState } from 'react';

function LandingPage() {
  const [email, setEmail] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = () => {
    alert(`Email entered: ${email}`);
  };

  return (
    <div>
      <input 
        type="email" 
        value={email} 
        onChange={handleEmailChange} 
        placeholder="Enter your email" 
      />
      <button onClick={handleSubmit}>Log In</button>
    </div>
  );
}

export default LandingPage;
