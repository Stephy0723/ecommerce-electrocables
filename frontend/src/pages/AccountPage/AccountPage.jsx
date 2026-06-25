import React, { useState } from 'react';
import { LogOut, ShieldCheck, UserRound } from 'lucide-react';
import './AccountPage.css';

export default function AccountPage({
  store,
  saveStore,
  navigate,
  customerSession,
  setCustomerSession,
  showToast
}) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: customerSession?.name || '',
    email: customerSession?.email || '',
    phone: customerSession?.phone || '',
    city: customerSession?.city || '',
    address: customerSession?.address || '',
    taxId: customerSession?.taxId || ''
  });

  const submit = (event) => {
    event.preventDefault();
    const email = form.email.trim().toLowerCase();

    if (!email) {
      showToast('Ingresa un correo valido', 'error');
      return;
    }

    const existingClient = (store.clients || []).find((client) => client.email?.toLowerCase() === email);
    const nextCustomer = {
      id: existingClient?.id || crypto.randomUUID(),
      name: mode === 'login' ? existingClient?.name || form.name || 'Cliente ElectroCables' : form.name.trim(),
      email,
      phone: form.phone.trim() || existingClient?.phone || '',
      city: form.city.trim() || existingClient?.city || '',
      address: form.address.trim() || existingClient?.address || '',
      taxId: form.taxId.trim() || existingClient?.taxId || '',
      status: existingClient?.status || 'Cliente web'
    };

    if (mode === 'register' && (!nextCustomer.name || !nextCustomer.phone)) {
      showToast('Completa nombre y telefono para crear la cuenta', 'error');
      return;
    }

    if (!existingClient) {
      saveStore({
        ...store,
        clients: [nextCustomer, ...(store.clients || [])]
      });
    }

    setCustomerSession(nextCustomer);
    showToast(mode === 'login' ? `Bienvenido, ${nextCustomer.name}` : 'Cuenta creada correctamente');
    navigate('/pedidos');
  };

  const logout = () => {
    setCustomerSession(null);
    showToast('Sesion de cliente cerrada');
  };

  if (customerSession) {
    return (
      <main className="account-page">
        <section className="account-panel account-signed-panel">
          <div className="account-signed-head">
            <span className="account-avatar">{customerSession.name?.slice(0, 1).toUpperCase()}</span>
            <div>
              <span className="eyebrow">Mi cuenta</span>
              <h1>{customerSession.name}</h1>
              <p>{customerSession.email}</p>
            </div>
          </div>

          <div className="account-info-grid">
            <div>
              <span>Telefono</span>
              <strong>{customerSession.phone || 'No definido'}</strong>
            </div>
            <div>
              <span>Ciudad</span>
              <strong>{customerSession.city || 'No definida'}</strong>
            </div>
            <div>
              <span>RNC/Cedula</span>
              <strong>{customerSession.taxId || 'Consumidor final'}</strong>
            </div>
            <div>
              <span>Direccion</span>
              <strong>{customerSession.address || 'No definida'}</strong>
            </div>
          </div>

          <div className="account-actions">
            <button className="primary-btn" onClick={() => navigate('/pedidos')}>Ver mis pedidos</button>
            <button className="secondary" onClick={() => navigate('/checkout')}>Ir al checkout</button>
            <button className="secondary danger-action" onClick={logout}>
              <LogOut size={16} /> Cerrar sesion
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="account-page">
      <section className="account-panel">
        <div className="account-heading">
          <span className="account-icon"><UserRound size={24} /></span>
          <div>
            <span className="eyebrow">Cuenta de cliente</span>
            <h1>Entrar a ElectroCables</h1>
            <p>Accede para revisar pedidos, guardar datos de envio y avanzar mas rapido en checkout.</p>
          </div>
        </div>

        <div className="account-tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
            Iniciar sesion
          </button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>
            Registrarse
          </button>
        </div>

        <form className="account-form" onSubmit={submit}>
          {mode === 'register' ? (
            <label className="account-label wide">
              Nombre completo
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Nombre y apellido"
              />
            </label>
          ) : null}

          <label className="account-label wide">
            Correo
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="cliente@correo.com"
            />
          </label>

          {mode === 'register' ? (
            <>
              <label className="account-label">
                Telefono
                <input
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  placeholder="809-000-0000"
                />
              </label>
              <label className="account-label">
                Ciudad
                <input
                  value={form.city}
                  onChange={(event) => setForm({ ...form, city: event.target.value })}
                  placeholder="Santo Domingo"
                />
              </label>
              <label className="account-label">
                RNC/Cedula
                <input
                  value={form.taxId}
                  onChange={(event) => setForm({ ...form, taxId: event.target.value })}
                  placeholder="Opcional"
                />
              </label>
              <label className="account-label wide">
                Direccion principal
                <input
                  value={form.address}
                  onChange={(event) => setForm({ ...form, address: event.target.value })}
                  placeholder="Calle, numero, sector"
                />
              </label>
            </>
          ) : null}

          <button className="primary-btn account-submit" type="submit">
            {mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>

        <div className="account-note">
          <ShieldCheck size={16} />
          <span>Cuenta simulada en frontend. Tus datos quedan guardados localmente en este navegador.</span>
        </div>
      </section>
    </main>
  );
}
