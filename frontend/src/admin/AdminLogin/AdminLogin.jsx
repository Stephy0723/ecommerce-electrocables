import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { adminCredentials } from '../../utils/constants';
import { setAdminSession, addLog } from '../../utils/storage';
import './AdminLogin.css';

export default function AdminLogin({ navigate, showToast }) {
  const [form, setForm] = useState({ email: '', password: '' });

  const submit = (event) => {
    event.preventDefault();
    if (form.email === adminCredentials.email && form.password === adminCredentials.password) {
      const session = { email: form.email, role: 'Admin', date: new Date().toISOString() };
      setAdminSession(session);
      addLog('Login admin', 'admin');
      showToast('Sesión admin iniciada');
      navigate('/admin/dashboard');
      return;
    }
    showToast('Credenciales de administrador inválidas', 'error');
  };

  const fillDemoCredentials = () => {
    setForm({
      email: adminCredentials.email,
      password: adminCredentials.password
    });
  };

  return (
    <main className="admin-login-layout">
      <div className="login-container animate-fade">
        <form onSubmit={submit} className="login-card">
          <div className="login-header">
            <span className="brand-mark login-brand-mark">EC</span>
            <div className="brand-title">
              <h2>ElectroCables</h2>
              <span className="eyebrow">Panel de Administración</span>
            </div>
          </div>
          
          <h1 className="login-title">Acceso al Sistema</h1>
          <p className="login-desc">Ingrese sus credenciales autorizadas para gestionar productos, pedidos y reportes.</p>

          <div className="demo-alert" onClick={fillDemoCredentials} title="Haga clic para autocompletar">
            <AlertCircle size={16} className="text-electric" />
            <div>
              <b>Acceso de Prueba (Clic para rellenar):</b>
              <p>{adminCredentials.email} <span>/</span> {adminCredentials.password}</p>
            </div>
          </div>
          
          <div className="login-fields">
            <label className="login-field">
              Correo Electrónico
              <div className="input-group">
                <Mail size={16} className="input-icon" />
                <input 
                  type="email"
                  value={form.email} 
                  onChange={(event) => setForm({ ...form, email: event.target.value })} 
                  placeholder="nombre@electrocables.com" 
                  required
                />
              </div>
            </label>
            
            <label className="login-field">
              Contraseña
              <div className="input-group">
                <Lock size={16} className="input-icon" />
                <input 
                  type="password" 
                  value={form.password} 
                  onChange={(event) => setForm({ ...form, password: event.target.value })} 
                  placeholder="••••••••" 
                  required
                />
              </div>
            </label>
          </div>
          
          <button type="submit" className="primary-btn login-btn">
            <ShieldCheck size={18} /> Entrar al Panel
          </button>

          <button type="button" className="back-store-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={14} /> Volver a la Tienda Pública
          </button>
        </form>
      </div>
    </main>
  );
}
