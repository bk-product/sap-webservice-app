import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    // const soapRequest = `
    //   <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="urn:sap-com:document:sap:rfc:functions">
    //     <soapenv:Header/>
    //     <soapenv:Body>
    //       <web:ZCXP_BK_ZST_1>
    //         <username>${username}</username>
    //         <password>${password}</password>
    //       </web:ZCXP_BK_ZST_1>
    //     </soapenv:Body>
    //   </soapenv:Envelope>
    // `;
  
    const soapRequest = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="urn:sap-com:document:sap:rfc:functions">
  <soapenv:Header/>
  <soapenv:Body>
    <web:ZCXP_BK_ZST_1>
    <username>${username}</username>
     <password>${password}</password>
    </web:ZCXP_BK_ZST_1>
  </soapenv:Body>
</soapenv:Envelope>`;

    console.log("Sending request to proxy with data:", { username });

    try {
      const response = await axios.post(
        'http://localhost:3000/proxy-sap', // local proxy server
        { username, password, soapRequest },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        }
      );
  
      if (response.status === 200) {
        setAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        setError('Invalid credentials or server error.');
      }
    } catch (err) {
      console.log("Error: ", err);

      if (err.response) {
        setError(`Error: ${err.response.status} - ${err.response.statusText}`);
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timed out or server is unavailable.');
      } else {
        setError('Network error or server (proxy) is unavailable.');
      }
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button type="submit" className="login-button">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Login;
