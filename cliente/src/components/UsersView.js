import React, { useEffect, useState } from 'react';
import { obtenerUsuarios, cambiarEstadoUsuario } from '../services/UsuarioService';
import Modal from './Modal';
import Toast from './Toast';

function UsersView({ onBack }) {
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' });
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    obtenerUsuarios()
      .then(data => {
        if (Array.isArray(data)) {
          const normalizados = data.map(u => ({
            ...u,
            estado_usuario: Number(u.estado_usuario)
          }));
          setUsuarios(normalizados);
        } else {
          setUsuarios([]);
          setMensaje('Respuesta inesperada del servidor');
        }
      })
      .catch(() => setMensaje('Error al cargar usuarios'));
  }, []);

  const showToast = (mensaje, tipo = 'success') => {
    setToast({ visible: true, mensaje, tipo });
    setTimeout(() => setToast({ ...toast, visible: false }), 2500);
  };

  const confirmarToggle = (user) => {
    setUsuarioSeleccionado(user);
    setModalOpen(true);
  };

  const toggleEstado = async () => {
    if (!usuarioSeleccionado) return;
    const { id, estado_usuario } = usuarioSeleccionado;
    const nuevoEstado = Number(estado_usuario) === 1 ? 0 : 1;
    try {
      const data = await cambiarEstadoUsuario(id, nuevoEstado);
      if (data.success) {
        const actualizados = await obtenerUsuarios();
        setUsuarios(
          Array.isArray(actualizados)
            ? actualizados.map(u => ({
                ...u,
                estado_usuario: Number(u.estado_usuario)
              }))
            : []
        );
        setMensaje('');
        showToast(
          `Usuario ${nuevoEstado === 1 ? 'activado' : 'desactivado'} correctamente`,
          'success'
        );
      } else {
        setMensaje(data.message || 'Error al cambiar estado');
        showToast(data.message || 'Error al cambiar estado', 'error');
      }
    } catch {
      setMensaje('Error de conexión');
      showToast('Error de conexión', 'error');
    }
    setModalOpen(false);
    setUsuarioSeleccionado(null);
  };

  return (
    <div style={{
      maxWidth: 1000,
      margin: '2rem auto',
      background: '#fff',
      borderRadius: 10,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      padding: '2rem'
    }}>
      <button
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: '#0071ce',
          fontSize: 22,
          cursor: 'pointer',
          marginBottom: 8
        }}
      >
        &larr; Volver
      </button>

      <h2 style={{ textAlign: 'left' }}>Usuarios</h2>

      {mensaje && <div style={{ marginBottom: 16, color: 'red' }}>{mensaje}</div>}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th style={{ width: 40, textAlign: 'center', padding: 8 }}>ID</th>
            <th style={{ width: 150, textAlign: 'center', padding: 8 }}>Nombre</th>
            <th style={{ width: 200, textAlign: 'center', padding: 8 }}>Correo</th>
            <th style={{ width: 100, textAlign: 'center', padding: 8 }}>Rol</th>
            <th style={{ width: 160, textAlign: 'center', padding: 8 }}>Fecha registro</th>
            <th style={{ width: 120, textAlign: 'center', padding: 8 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(user => {
            const esActivo = Number(user.estado_usuario) === 1;
            return (
              <tr
                key={user.id}
                className={selectedRow === user.id ? 'selected-row' : ''}
                onClick={() => setSelectedRow(user.id)}
              >
                <td style={{ textAlign: 'center', padding: 8 }}>{user.id}</td>
                <td style={{ textAlign: 'center', padding: 8 }}>{user.nombre}</td>
                <td style={{ textAlign: 'center', padding: 8 }}>{user.correo}</td>
                <td style={{ textAlign: 'center', padding: 8 }}>{user.rol || '-'}</td>
                <td style={{ textAlign: 'center', padding: 8 }}>
                  {user.fecha_registro
                    ? new Date(user.fecha_registro).toLocaleString()
                    : '-'}
                </td>
                <td style={{ textAlign: 'center', padding: 8 }}>
                  {user.rol !== 'admin' && (
                    <button
                      onClick={() => confirmarToggle(user)}
                      style={{
                        background: esActivo ? '#e74c3c' : '#2ecc40',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        padding: '6px 14px',
                        cursor: 'pointer'
                      }}
                    >
                      {esActivo ? 'Desactivar' : 'Activar'}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setUsuarioSeleccionado(null); }}
        title="Confirmar acción"
        width={400}
      >
        <div style={{ marginBottom: 24, fontSize: 18, textAlign: 'center' }}>
          {usuarioSeleccionado && (
            <>
              ¿Seguro que deseas {usuarioSeleccionado.estado_usuario === 1 ? 'desactivar' : 'activar'} al usuario <b>{usuarioSeleccionado.nombre}</b>?
              <div style={{ fontSize: 15, color: '#e74c3c', marginTop: 10 }}>
                {usuarioSeleccionado.estado_usuario === 1
                  ? 'Esta acción le quitará al usuario el acceso al sistema'
                  : 'Esta acción le permitirá al usuario el acceso al sistema'}
              </div>
            </>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <button
            onClick={toggleEstado}
            style={{
              background: '#1976d2',
              color: '#fff',
              padding: '8px 24px',
              borderRadius: 4,
              border: 'none',
              fontWeight: 600
            }}
          >
            Confirmar
          </button>
          <button
            onClick={() => { setModalOpen(false); setUsuarioSeleccionado(null); }}
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
        </div>
      </Modal>

      {/* Toast de éxito o error */}
      <div style={{
        position: 'fixed',
        bottom: 30,
        right: 30,
        zIndex: 9999
      }}>
        <Toast mensaje={toast.mensaje} visible={toast.visible} tipo={toast.tipo} />
      </div>
    </div>
  );
}

export default UsersView;
