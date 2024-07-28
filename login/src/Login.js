// src/Login.js
import React, { useState } from 'react';
import { encryptString } from './cryptoUtils';

function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Verileri şifrele
    const encryptedUserName = await encryptString(userName);
    const encryptedPassword = await encryptString(password);

    try {
      const response = await fetch('https://localhost:7053/Login', {
        method: 'POST',
        headers: {
          'Accept': 'text/plain',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userName: encryptedUserName, password: encryptedPassword })
      });

      const result = await response.json();

      if (response.ok) {
        if (result === true) {
          alert('Login successful');
        } else if (result === false) {
          alert('Login failed');
        } else {
          alert('Unexpected response');
        }
      } else {
        alert('Server error: ' + response.statusText);
      }
    } catch (error) {
      alert('Error during fetch: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          User Name:
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
