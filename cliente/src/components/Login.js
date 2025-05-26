import React, { useState } from 'react';
import styled from 'styled-components';

function Login({ onLogin, onShowRegister }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    onLogin && onLogin({ correo, contrasena });
  };

  return (
    <StyledWrapper>
      <div className="form-container">
        <img
          src="/images/BlackHole.gif"
          alt="Decoración"
          className="gif-decorativo"
        />
        <p className="title">Iniciar sesión</p>
        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              type="email"
              name="correo"
              id="correo"
              placeholder="Ingresa tu correo"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              name="contrasena"
              id="contrasena"
              placeholder="Ingresa tu contraseña"
              value={contrasena}
              onChange={e => setContrasena(e.target.value)}
              required
            />
            <div className="forgot">
              <a rel="noopener noreferrer" href="#">¿Olvidaste tu contraseña?</a>
            </div>
          </div>
          <button className="sign" type="submit" disabled={loading}>
            {loading ? <div className="spinner"></div> : 'Iniciar sesión'}
          </button>
        </form>
        <p className="signup">
          ¿No tienes cuenta?{' '}
          <button
            type="button"
            className="link-button"
            onClick={onShowRegister}
          >
            Crear cuenta
          </button>
        </p>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;

  .form-container {
    width: 340px;
    border-radius: 0.75rem;
    background-color: #000;
    padding: 2rem;
    color: #fff3e0;
    border: 1.2px solid #ff4500;
    /* Brillo más intenso */
    box-shadow:
      0 0 40px 8px #ff4500cc,
      0 0 0 0 #ff450033;
    position: relative;
    z-index: 1;
  }

  .title {
    text-align: center;
    font-size: 1.7rem;
    line-height: 2.2rem;
    font-weight: 700;
    color: #ff7043;
    margin-bottom: 0.5rem;
  }

  .form {
    margin-top: 1.5rem;
  }

  .input-group {
    margin-top: 0.7rem;
    font-size: 0.95rem;
    line-height: 1.25rem;
  }

  .input-group label {
    display: block;
    color: #ffab91;
    margin-bottom: 4px;
  }

  .input-group input {
    width: 100%;
    border-radius: 0.375rem;
    border: 1.5px solid #ff7043;
    outline: 0;
    background-color: #181818;
    padding: 0.75rem 1rem;
    color: #fff3e0;
    margin-bottom: 0.5rem;
    box-sizing: border-box;
    transition: border 0.2s;
  }

  .input-group input:focus {
    border-color: #ff9800;
    background-color: #232323;
  }

  .forgot {
    display: flex;
    justify-content: flex-end;
    font-size: 0.83rem;
    line-height: 1rem;
    color: #ffab91;
    margin: 8px 0 14px 0;
  }

  .forgot a,.signup a {
    color: #ff7043;
    text-decoration: none;
    font-size: 14px;
    cursor: pointer;
    transition: color 0.2s;
  }

  .forgot a:hover, .signup a:hover {
    color: #ff9800;
    text-decoration: underline #ff9800;
  }

  .sign {
    display: block;
    width: 100%;
    background: linear-gradient(90deg, #ff7043 0%, #ff9800 100%);
    padding: 0.75rem;
    text-align: center;
    color: #fff;
    border: none;
    border-radius: 0.375rem;
    font-weight: 600;
    margin-top: 10px;
    position: relative;
    font-size: 1.1rem;
    box-shadow: 0 0 16px #ff980088;
    transition: background 0.2s;
  }

  .sign:hover {
    background: linear-gradient(90deg, #ff9800 0%, #ff7043 100%);
  }

  .spinner {
    margin: 0 auto 1rem auto;
    border: 4px solid #ff704344;
    border-top: 4px solid #ff7043;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg);}
    100% { transform: rotate(360deg);}
  }

  .signup {
    text-align: center;
    font-size: 0.85rem;
    line-height: 1rem;
    color: #ffab91;
    margin-top: 1rem;
  }

  .link-button {
    color: #ff9800;
    background: none;
    border: none;
    padding: 0;
    font-size: 0.85rem;
    line-height: 1rem;
    cursor: pointer;
    text-decoration: underline;
    margin-left: 2px;
    transition: color 0.2s;
  }

  .link-button:hover {
    color: #ff7043;
  }

  .gif-decorativo {
    display: block;
    margin: 0 auto 1rem auto;
    width: 120px;
    height: 120px;
    object-fit: contain;
    border-radius: 0.5rem;
    /* Brillo eliminado */
    box-shadow: none;
  }
`;

export default Login;