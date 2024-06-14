import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      if (response.ok) {
        setRegistrationSuccess(true);
        // Stockage du rôle utilisateur dans le localStorage
        localStorage.setItem('userRole', role);
      } else {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setError(data.message || 'Error registering user');
        } else {
          setError('Error registering user: Unexpected response from the server');
        }
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setError('Error registering user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (registrationSuccess) {
      console.log('User successfully registered!');
      // Réinitialisez l'état après avoir traité le succès si nécessaire
      // setRegistrationSuccess(false);
    }
  }, [registrationSuccess]);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card shadow-lg my-5">
            <div className="card-body p-5">
              <div className="text-center">
                <h1 className="h4 text-gray-900 mb-4">Create an Account</h1>
              </div>
              <form className="user" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-user"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control form-control-user"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control form-control-user"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <select
                    className="form-control form-control-user"
                    placeholder="Your Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="" disabled>Select a Role</option>

                    <option value="1">Developpeur</option>
                    <option value="2">Chef Projet</option>
                    <option value="3">Directeur Commercial</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-user btn-block"
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </form>
              <hr />
              <div className="text-center">
                <a className="small" href="forgot-password.html">Forgot Password?</a>
              </div>
              <div className="text-center">
                <Link to="/login" className="small">Already have an account? Login!</Link>
              </div>
              {error && (
                <div className="text-center text-danger mt-3">
                  {error}
                </div>
              )}
              {registrationSuccess && (
                <div className="text-center text-success mt-3">
                  User successfully registered! Please proceed to login.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
