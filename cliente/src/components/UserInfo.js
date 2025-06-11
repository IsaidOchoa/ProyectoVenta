import React, { useState, useEffect } from 'react';
import { FaEdit, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import Toast from './Toast';
import Modal from './Modal';
import { actualizarUsuario, cambiarEstadoUsuario, obtenerUsuarioPorId } from '../services/UsuarioService'; // Asegúrate de tener esta función en tu servicio

function UserInfo({ usuario, onUpdateUsuario, onBack }) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(usuario || {});
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' });
  const [modal, setModal] = useState({ visible: false, accion: null });
  const [showPassword, setShowPassword] = useState(false);

  // Cargar usuario actualizado al montar o cuando usuario.id cambie
  useEffect(() => {
    if (usuario?.id) {
      obtenerUsuarioPorId(usuario.id).then(res => {
        if (res.success && res.usuario) {
          setForm(res.usuario);
        }
      });
    }
  }, [usuario?.id]);

  if (!usuario) return <div style={{ color: '#222', padding: 24 }}>No hay información de usuario.</div>;

  // Función para censurar la contraseña
  const censurar = (str) => str ? '•'.repeat(str.length) : '';

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showToast = (mensaje, tipo = 'success') => {
    setToast({ visible: true, mensaje, tipo });
    setTimeout(() => setToast({ ...toast, visible: false }), 2500);
  };

  // Actualizar usuario en backend
  const handleSave = async () => {
    setError('');
    if (password || password2) {
      if (password !== password2) {
        setError('Las contraseñas no coinciden.');
        showToast('Las contraseñas no coinciden.', 'error');
        return;
      }
      if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        showToast('La contraseña debe tener al menos 6 caracteres.', 'error');
        return;
      }
      form.contrasena = password;
    }
    try {
      await actualizarUsuario(form.id, form);
      // Vuelve a obtener el usuario actualizado
      const res = await obtenerUsuarioPorId(form.id);
      if (res.success && res.usuario) {
        setForm(res.usuario);
        onUpdateUsuario(res.usuario); // Actualiza el usuario global si es necesario
      }
      setEditMode(false);
      setPassword('');
      setPassword2('');
      showToast('Información actualizada correctamente', 'success');
    } catch (e) {
      setError('Error al actualizar usuario.');
      showToast('No se pudo actualizar la información', 'error');
    }
  };

  // Desactivar cuenta
  const handleDeactivate = async () => {
    try {
      await cambiarEstadoUsuario(usuario.id, 0); // 0 = desactivado
      showToast('Cuenta desactivada', 'success');
      setTimeout(() => {
        window.location.href = '/login'; // Redirige al login o página principal
      }, 2000);
    } catch (e) {
      showToast('No se pudo desactivar la cuenta', 'error');
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm(usuario);
    setPassword('');
    setPassword2('');
    setError('');
    showToast('Edición cancelada', 'info');
  };

  // Modal de confirmación
  const ConfirmModal = ({ visible, mensaje, onConfirm, onCancel }) => {
    if (!visible) return null;
    return (
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 8,
          padding: 32,
          minWidth: 320,
          boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: 24, fontSize: 18 }}>{mensaje}</div>
          <button
            onClick={onConfirm}
            style={{ background: '#1976d2', color: '#fff', padding: '8px 24px', borderRadius: 4, border: 'none', fontWeight: 600, marginRight: 16 }}
          >
            Confirmar
          </button>
          <button
            onClick={onCancel}
            style={{ background: '#eee', color: '#1976d2', padding: '8px 24px', borderRadius: 4, border: 'none', fontWeight: 600 }}
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  };

  // Acciones para los botones
  const onGuardarClick = () => setModal({ visible: true, accion: 'guardar' });
  const onCancelarClick = () => setModal({ visible: true, accion: 'cancelar' });
  const onDesactivarClick = () => setModal({ visible: true, accion: 'desactivar' });

  const handleModalConfirm = () => {
    if (modal.accion === 'guardar') {
      setModal({ visible: false, accion: null });
      handleSave();
    } else if (modal.accion === 'cancelar') {
      setModal({ visible: false, accion: null });
      handleCancel();
    } else if (modal.accion === 'desactivar') {
      setModal({ visible: false, accion: null });
      handleDeactivate();
    }
  };
  const handleModalCancel = () => setModal({ visible: false, accion: null });

  return (
    <div style={{
      maxWidth: 500,
      margin: '40px auto',
      background: '#fff',
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      padding: 32,
      color: '#222',
      position: 'relative'
    }}>
      {/* Toast */}
      <div style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 2000
      }}>
        <Toast mensaje={toast.mensaje} visible={toast.visible} tipo={toast.tipo} />
      </div>
      {/* Modal de confirmación */}
      <Modal
        open={modal.visible}
        onClose={handleModalCancel}
        title={
          modal.accion === 'guardar'
            ? 'Confirmar guardado'
            : modal.accion === 'cancelar'
              ? 'Cancelar edición'
              : 'Desactivar cuenta'
        }
        width={400}
        showClose={false}
      >
        <div style={{ marginBottom: 24, fontSize: 18 }}>
          {modal.accion === 'guardar'
            ? '¿Deseas guardar los cambios?'
            : modal.accion === 'cancelar'
              ? '¿Deseas cancelar la edición? Se perderán los cambios no guardados.'
              : '¿Seguro que deseas desactivar tu cuenta? No podrás acceder hasta que un administrador la reactive.'}
        </div>
        <button
          onClick={handleModalConfirm}
          style={{
            background: modal.accion === 'desactivar' ? '#d32f2f' : '#1976d2',
            color: '#fff',
            padding: '8px 24px',
            borderRadius: 4,
            border: 'none',
            fontWeight: 600,
            marginRight: 16
          }}
        >
          Confirmar
        </button>
        <button
          onClick={handleModalCancel}
          style={{
            background: '#eee',
            color: '#1976d2',
            padding: '8px 24px',
            borderRadius: 4,
            border: 'none',
            fontWeight: 600
          }}
        >
          Cancelar
        </button>
      </Modal>

      {/* Botón atrás */}
      <button
        onClick={() => {
          if (onBack) onBack();
          else window.location.href = '/';
        }}
        style={{
          position: 'absolute',
          left: 24,
          top: 24,
          background: 'none',
          border: 'none',
          color: '#1976d2',
          fontSize: 22,
          cursor: 'pointer'
        }}
        title="Volver"
      >
        <FaArrowLeft />
      </button>

      {/* Botón editar */}
      {!editMode && (
        <button
          onClick={() => setEditMode(true)}
          style={{
            position: 'absolute',
            right: 24,
            top: 24,
            background: 'none',
            border: 'none',
            color: '#1976d2',
            fontSize: 22,
            cursor: 'pointer'
          }}
          title="Editar información"
        >
          <FaEdit />
        </button>
      )}

      <h2 style={{ marginBottom: 24, color: '#1976d2', textAlign: 'center' }}>Información de Usuario</h2>

      {/* Información personal */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ color: '#1976d2', fontSize: 18, marginBottom: 12 }}>Información personal</h3>
        <div style={{ marginBottom: 10 }}>
          <strong>Nombre:</strong>{' '}
          {editMode
            ? <input name="nombre" value={form.nombre} onChange={handleChange} style={{ width: 200 }} />
            : form.nombre}
        </div>
        <div style={{ marginBottom: 10 }}>
          <strong>Apellido:</strong>{' '}
          {editMode
            ? <input name="apellido" value={form.apellido} onChange={handleChange} style={{ width: 200 }} />
            : form.apellido}
        </div>
        <div style={{ marginBottom: 10 }}>
          <strong>Correo:</strong>{' '}
          {editMode
            ? <input name="correo" value={form.correo} onChange={handleChange} style={{ width: 250 }} />
            : form.correo}
        </div>
        <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <strong>Contraseña:</strong>{' '}
          {editMode ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nueva contraseña"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ width: 180, marginBottom: 6 }}
                />
                <button
                  onClick={() => setShowPassword(v => !v)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#1976d2',
                    fontSize: 18,
                    marginLeft: 4,
                    padding: 0
                  }}
                  title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  tabIndex={-1}
                  type="button"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirmar contraseña"
                value={password2}
                onChange={e => setPassword2(e.target.value)}
                style={{ width: 180 }}
              />
            </div>
          ) : (
            <span style={{ fontFamily: 'monospace', fontSize: 18 }}>
              {censurar(form.contrasena)}
            </span>
          )}
        </div>
      </div>

      {/* Dirección de envío */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ color: '#1976d2', fontSize: 18, marginBottom: 12 }}>Dirección de envío</h3>
        <div style={{ marginBottom: 10 }}>
          <strong>Teléfono:</strong>{' '}
          {editMode
            ? <input name="telefono" value={form.telefono} onChange={handleChange} style={{ width: 150 }} />
            : usuario.telefono}
        </div>
        <div style={{ marginBottom: 10 }}>
          <strong>País:</strong>{' '}
          {editMode
            ? <input name="pais" value={form.pais} onChange={handleChange} style={{ width: 150 }} />
            : usuario.pais}
        </div>
        <div style={{ marginBottom: 10 }}>
          <strong>Estado/Dirección:</strong>{' '}
          {editMode
            ? <input name="estado_direccion" value={form.estado_direccion} onChange={handleChange} style={{ width: 150 }} />
            : usuario.estado_direccion}
        </div>
        <div style={{ marginBottom: 10 }}>
          <strong>Ciudad:</strong>{' '}
          {editMode
            ? <input name="ciudad" value={form.ciudad} onChange={handleChange} style={{ width: 150 }} />
            : usuario.ciudad}
        </div>
        <div style={{ marginBottom: 10 }}>
          <strong>Calle:</strong>{' '}
          {editMode
            ? <input name="calle" value={form.calle} onChange={handleChange} style={{ width: 150 }} />
            : usuario.calle}
        </div>
        <div style={{ marginBottom: 10 }}>
          <strong>Colonia:</strong>{' '}
          {editMode
            ? <input name="colonia" value={form.colonia} onChange={handleChange} style={{ width: 150 }} />
            : usuario.colonia}
        </div>
        <div style={{ marginBottom: 10 }}>
          <strong>Código Postal:</strong>{' '}
          {editMode
            ? <input name="codigo_postal" value={form.codigo_postal} onChange={handleChange} style={{ width: 100 }} />
            : usuario.codigo_postal}
        </div>
        <div style={{ marginBottom: 10 }}>
          <strong>Número de domicilio:</strong>{' '}
          {editMode
            ? <input name="numero_domicilio" value={form.numero_domicilio} onChange={handleChange} style={{ width: 80 }} />
            : usuario.numero_domicilio}
        </div>
      </div>

      {/* Detalles */}
      <div>
        <h3 style={{ color: '#1976d2', fontSize: 18, marginBottom: 12 }}>Detalles</h3>
        <div style={{ marginBottom: 10 }}>
          <strong>Usuario:</strong> {usuario.usuario}
        </div>
        <div style={{ marginBottom: 10 }}>
          <strong>Fecha de registro:</strong> {usuario.fecha_registro}
        </div>
      </div>

      {/* Error */}
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}

      {/* Botones Guardar/Cancelar */}
      {editMode && (
        <div style={{ marginTop: 28, display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button
            className="btn btn-primary"
            onClick={onGuardarClick}
            style={{ background: '#1976d2', color: '#fff', padding: '8px 24px', borderRadius: 4, border: 'none', fontWeight: 600 }}
          >
            Guardar
          </button>
          <button
            className="btn btn-secondary"
            onClick={onCancelarClick}
            style={{ background: '#eee', color: '#1976d2', padding: '8px 24px', borderRadius: 4, border: 'none', fontWeight: 600 }}
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Botón Desactivar cuenta */}
      {!editMode && (
        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <button
            style={{
              background: usuario.rol === 'admin' ? '#aaa' : '#e53935',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '1rem 2.5rem',
              fontWeight: 'bold',
              fontSize: 18,
              marginTop: 18,
              cursor: usuario.rol === 'admin' ? 'not-allowed' : 'pointer',
              opacity: usuario.rol === 'admin' ? 0.6 : 1
            }}
            onClick={onDesactivarClick}
            disabled={usuario.rol === 'admin'}
          >
            Desactivar cuenta
          </button>
        </div>
      )}
    </div>
  );
}

export default UserInfo;