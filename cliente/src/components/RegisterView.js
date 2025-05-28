import React, { useState } from 'react';
import styled from 'styled-components';

const Register = ({ onShowLogin }) => {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    contrasena: '',
    pais: '',
    estado_direccion: '',
    ciudad: '',
    calle: '',
    colonia: '',
    codigo_postal: '',
    numero_domicilio: ''
  });
  const [mensaje, setMensaje] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMensaje('');
    console.log('Datos enviados al backend:', form); // <-- Aquí
    try {
      const res = await fetch('http://localhost/ProyectoVenta/public/api/usuarios/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const text = await res.text();
      console.log('Respuesta cruda:', text);

      let data = {};
      try {
        data = JSON.parse(text);
      } catch (e) {
        setMensaje('Error inesperado en el servidor');
        console.error('Error al parsear JSON:', e);
        return;
      }

      if (data.success) {
        setMensaje('¡Registro exitoso! Ahora puedes iniciar sesión.');
      } else {
        setMensaje(data.message || 'Error al registrar');
      }
    } catch (err) {
      setMensaje('Error de conexión');
      console.error(err);
    }
  };

  return (
    <StyledWrapper>
      <div className="form-container">
        <img
          src="/images/BlackHole.gif"
          alt="Decoración"
          className="gif-decorativo"
        />
        <p className="title">Crear cuenta</p>
        <form className="form" onSubmit={handleSubmit}>
          <div className="row">
            <div className="input-group">
              <label>Nombre</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Apellido</label>
              <input name="apellido" value={form.apellido} onChange={handleChange} required />
            </div>
          </div>
          <div className="row">
            <div className="input-group">
              <label>Correo electrónico</label>
              <input type="email" name="correo" value={form.correo} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Contraseña</label>
              <input type="password" name="contrasena" value={form.contrasena} onChange={handleChange} required />
            </div>
          </div>
          <div className="row">
            <div className="input-group">
              <label>Teléfono</label>
              <input name="telefono" value={form.telefono} onChange={handleChange} required />
            </div>
          </div>
          <div className="row">
            <div className="input-group">
              <label>País</label>
              <input name="pais" value={form.pais} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Estado</label>
              <input name="estado_direccion" value={form.estado_direccion} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Ciudad</label>
              <input name="ciudad" value={form.ciudad} onChange={handleChange} required />
            </div>
          </div>
          <div className="row">
            <div className="input-group">
              <label>Calle</label>
              <input name="calle" value={form.calle} onChange={handleChange} required />
            </div>
          </div>
          <div className="row">
            <div className="input-group">
              <label>Colonia</label>
              <input name="colonia" value={form.colonia} onChange={handleChange} required />
            </div>
          </div>
          <div className="row">
            <div className="input-group">
              <label>Código Postal</label>
              <input name="codigo_postal" value={form.codigo_postal} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Número Domicilio</label>
              <input name="numero_domicilio" value={form.numero_domicilio} onChange={handleChange} required />
            </div>
          </div>
          <button className="sign" type="submit">Registrarse</button>
        </form>
        {mensaje && <div style={{ color: '#ff7043', marginTop: '1rem', textAlign: 'center' }}>{mensaje}</div>}
        <p className="signup">
          ¿Ya tienes cuenta?{' '}
          <button
            type="button"
            className="link-button"
            onClick={onShowLogin}
          >
            Iniciar sesión
          </button>
        </p>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;

  .form-container {
    width: 600px;
    border-radius: 0.75rem;
    background-color: #000;
    padding: 2rem;
    color: #fff3e0;
    border: 1.2px solid #ff4500;
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

  .row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1.2rem;
    margin-bottom: 0.7rem;
  }

  .input-group {
    font-size: 0.95rem;
    line-height: 1.25rem;
    display: flex;
    flex-direction: column;
  }

  .input-group label {
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
    margin-bottom: 0.1rem;
    box-sizing: border-box;
    transition: border 0.2s;
  }

  .input-group input:focus {
    border-color: #ff9800;
    background-color: #232323;
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
    margin-top: 1.2rem;
    position: relative;
    font-size: 1.1rem;
    box-shadow: 0 0 16px #ff980088;
    transition: background 0.2s;
  }

  .sign:hover {
    background: linear-gradient(90deg, #ff9800 0%, #ff7043 100%);
  }

  .gif-decorativo {
    display: block;
    margin: 0 auto 1rem auto;
    width: 120px;
    height: 120px;
    object-fit: contain;
    border-radius: 0.5rem;
    box-shadow: none;
  }

  .signup {
    text-align: center;
    margin-top: 1rem;
    font-size: 0.9rem;
    color: #ffab91;
  }

  .link-button {
    background: none;
    border: none;
    color: #ff7043;
    padding: 0;
    font: inherit;
    cursor: pointer;
    text-decoration: underline;
  }

  .link-button:hover {
    color: #ff9800;
  }
`;

export default Register;