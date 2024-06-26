import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from './lib/axios';
import { Input, Button } from 'antd';
import { UserOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined, MailOutlined } from '@ant-design/icons';
import './LoginForm.css'; // Assurez-vous d'importer le fichier CSS

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // État pour gérer l'affichage du mot de passe
  const [active, setActive] = useState(true); // Définissez la valeur initiale selon vos besoins
  const [userDeactivatedAlert, setUserDeactivatedAlert] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoginError('');
      setUserDeactivatedAlert(false);
      const response = await axiosInstance.post('/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.id);
      navigate('/tableauboard');
    } catch (error) {
      console.error('Login failed:', error.response.data);
      if (error.response.data === 'user desactived') {
        setUserDeactivatedAlert(true);
      } else if (error.response.data === 'user archived') {
        setError('Login failed: user archived');
      } else if (error.response.data === 'user not found') {
        setError('User not found. Please check your email.');
      } else if (error.response.data === 'invalid password') {
        setError('Incorrect password. Please try again.');
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="body-container">
      <div className="login-container">

        <div className="login-image-section">
          <div className="login-image-overlay">
            <h1>
              <span>C</span>
              <span>R</span>
              <span>M</span>
            </h1>
            <p>Customer Relationship Management</p>
          </div>
        </div>
        <div className="login-form-section">
          <div className="login-form-wrapper">
            <span className="login-account">Login Account</span>

            <form onSubmit={handleLogin}>
              {error && <div className={`custom-alert error-alert fade-out`}>{error}</div>}
              {loginError && <div className={`custom-alert error-alert fade-out`}>{loginError}</div>}
              {userDeactivatedAlert && (
                <div className={`custom-alert error-alert fade-out`}>
                  User is deactivated. Please contact support.
                </div>
              )}
              <div className="login-field">
                <Input
                  placeholder="Enter Email Address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  suffix={<MailOutlined className="icon-right" />} // Remplacez le préfixe par un suffixe pour placer l'icône à droite
                />
              </div>
              <div className="login-field">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  suffix={<EyeInvisibleOutlined onClick={() => setShowPassword(!showPassword)} />}
                />
              </div>
              <Button type="primary" htmlType="submit" className="login-button">Login</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
