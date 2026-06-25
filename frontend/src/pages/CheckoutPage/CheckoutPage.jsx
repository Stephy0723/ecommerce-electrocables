import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, FileText, Printer, Download, CreditCard, ShieldCheck, ShoppingBag, ArrowRight } from 'lucide-react';
import { orderTotals, addLog, money } from '../../utils/storage';
import OrderSummary from '../../components/OrderSummary/OrderSummary';
import EmptyState from '../../components/EmptyState/EmptyState';
import './CheckoutPage.css';

export default function CheckoutPage({ store, save, navigate, showToast, customerSession }) {
  const totals = orderTotals(store.cart || []);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    name: customerSession?.name || '',
    phone: customerSession?.phone || '',
    email: customerSession?.email || '',
    address: customerSession?.address || '',
    city: customerSession?.city || '',
    delivery: 'Entrega a domicilio',
    payment: 'Transferencia bancaria',
    taxType: 'Consumidor Final', // 'Consumidor Final' or 'Crédito Fiscal (RUC/RNC)'
    taxId: customerSession?.taxId || '9999999999999',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });

  const handleTaxTypeChange = (type) => {
    setForm((prev) => ({
      ...prev,
      taxType: type,
      taxId: type === 'Consumidor Final' ? '9999999999999' : ''
    }));
  };

  const generateAccessKey = (dateStr, ruc, seq) => {
    // Generates a mock 49-digit access key representing Ecuador SRI or DR style e-CF code
    const dateFormatted = dateStr.replace(/-/g, '').slice(0, 8); // YYYYMMDD
    const type = '01'; // Factura
    const estab = '001';
    const ptoEm = '001';
    const sequencePadded = seq.toString().padStart(9, '0');
    const numericCode = '12345678';
    const env = '1'; // Pruebas
    const emission = '1'; // Normal
    
    const baseKey = `${dateFormatted}${type}${ruc}${env}${estab}${ptoEm}${sequencePadded}${numericCode}${emission}`;
    
    // Simple modulo 11 check digit logic
    let sum = 0;
    let factor = 2;
    for (let i = baseKey.length - 1; i >= 0; i--) {
      sum += parseInt(baseKey[i], 10) * factor;
      factor = factor === 7 ? 2 : factor + 1;
    }
    const checkDigit = (11 - (sum % 11)) % 11;
    
    return `${baseKey}${checkDigit}`;
  };

  const submit = (event) => {
    event.preventDefault();
    if (!store.cart?.length) {
      showToast('El carrito está vacío', 'error');
      return;
    }

    const required = ['name', 'phone', 'email', 'address', 'city', 'taxId'];
    if (required.some((key) => !form[key].trim())) {
      showToast('Por favor, complete todos los campos obligatorios.', 'error');
      return;
    }

    if (form.taxType === 'Crédito Fiscal (RUC/RNC)' && form.taxId === '9999999999999') {
      showToast('Ingrese un RUC/RNC de contribuyente válido', 'error');
      return;
    }

    if (form.payment === 'Tarjeta simulada') {
      if (!form.cardNumber || !form.cardExpiry || !form.cardCvv) {
        showToast('Complete los datos de la tarjeta', 'error');
        return;
      }
    }

    // Generate electronic invoice details
    const seq = store.orders.length + 1;
    const rucEmisor = '1793123456001';
    const date = new Date().toISOString();
    const accessKey = generateAccessKey(date.split('T')[0], rucEmisor, seq);
    const invoiceNum = `001-001-${seq.toString().padStart(9, '0')}`;

    const order = {
      id: `EC-${Date.now().toString().slice(-7)}`,
      customer: {
        ...form,
        taxId: form.taxId || '9999999999999'
      },
      items: store.cart,
      totals,
      total: totals.total,
      status: 'Procesado',
      payment: form.payment,
      delivery: form.delivery,
      date,
      invoice: {
        number: invoiceNum,
        accessKey,
        rucEmisor,
        authCode: `SRI-AUTH-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
        status: 'AUTORIZADO',
        date
      }
    };

    save({
      ...store,
      orders: [order, ...store.orders],
      clients: store.clients.some((client) => client.email === form.email)
        ? store.clients
        : [{ id: crypto.randomUUID(), name: form.name, email: form.email, phone: form.phone, city: form.city, status: 'Nuevo' }, ...store.clients],
      incomes: [{ id: crypto.randomUUID(), concept: `Factura ${invoiceNum}`, method: form.payment, amount: totals.total, date: order.date }, ...store.incomes],
      cart: []
    });

    addLog(`Factura Electrónica emitida ${invoiceNum}`, form.name);
    setSuccess(order);
    showToast(`Factura Electrónica ${invoiceNum} emitida con éxito`);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!store.cart?.length && !success) {
    return (
      <EmptyState 
        title="No hay productos para pagar" 
        text="Agrega productos al carrito antes de confirmar una compra." 
        action="Ir al catálogo" 
        onAction={() => navigate('/catalogo')} 
      />
    );
  }

  return (
    <main className="checkout-page-layout">
      {!success ? (
        <form className="checkout-form-container" onSubmit={submit}>
          <div className="section-head tight">
            <div>
              <span className="eyebrow">Checkout Seguro</span>
              <h1>Datos de Facturación & Envío</h1>
            </div>
          </div>
          
          <div className="checkout-section">
            <h3 className="checkout-sec-title">1. Tipo de Comprobante Electrónico</h3>
            <div className="invoice-type-selector">
              <button 
                type="button" 
                className={`type-btn ${form.taxType === 'Consumidor Final' ? 'active' : ''}`}
                onClick={() => handleTaxTypeChange('Consumidor Final')}
              >
                <b>Consumidor Final</b>
                <span>Boleta simplificada</span>
              </button>
              <button 
                type="button" 
                className={`type-btn ${form.taxType === 'Crédito Fiscal (RUC/RNC)' ? 'active' : ''}`}
                onClick={() => handleTaxTypeChange('Crédito Fiscal (RUC/RNC)')}
              >
                <b>Crédito Fiscal</b>
                <span>Válido para gastos de RUC/RNC</span>
              </button>
            </div>
          </div>

          <div className="checkout-section">
            <h3 className="checkout-sec-title">2. Datos del Cliente</h3>
            <div className="checkout-form-grid">
              <label className="checkout-label wide">
                Razón Social / Nombre Completo *
                <input 
                  value={form.name} 
                  onChange={(event) => setForm({ ...form, name: event.target.value })} 
                  placeholder="Ej. ElectroConstrucciones S.A. o Juan Pérez"
                  required
                />
              </label>

              <label className="checkout-label">
                Identificación (RUC / RNC / Cédula) *
                <input 
                  value={form.taxId} 
                  disabled={form.taxType === 'Consumidor Final'}
                  onChange={(event) => setForm({ ...form, taxId: event.target.value.replace(/\D/g, '') })} 
                  placeholder={form.taxType === 'Consumidor Final' ? '9999999999999' : 'Ej. 1793123456001'}
                  required
                />
              </label>

              <label className="checkout-label">
                Teléfono de Contacto *
                <input 
                  value={form.phone} 
                  onChange={(event) => setForm({ ...form, phone: event.target.value })} 
                  placeholder="Ej. 809-555-0199"
                  required
                />
              </label>

              <label className="checkout-label wide">
                Correo Electrónico (Para envío de factura XML/PDF) *
                <input 
                  type="email" 
                  value={form.email} 
                  onChange={(event) => setForm({ ...form, email: event.target.value })} 
                  placeholder="ejemplo@correo.com"
                  required
                />
              </label>
            </div>
          </div>

          <div className="checkout-section">
            <h3 className="checkout-sec-title">3. Dirección de Entrega</h3>
            <div className="checkout-form-grid">
              <label className="checkout-label">
                Ciudad / Provincia *
                <input 
                  value={form.city} 
                  onChange={(event) => setForm({ ...form, city: event.target.value })} 
                  placeholder="Ej. Santo Domingo"
                  required
                />
              </label>
              <label className="checkout-label wide">
                Dirección Completa (Calle, Número, Edificio, Apto) *
                <input 
                  value={form.address} 
                  onChange={(event) => setForm({ ...form, address: event.target.value })} 
                  placeholder="Ej. Av. Winston Churchill #15, Torre Corporate"
                  required
                />
              </label>
              <label className="checkout-label">
                Método de Entrega
                <select value={form.delivery} onChange={(event) => setForm({ ...form, delivery: event.target.value })}>
                  <option>Entrega a domicilio</option>
                  <option>Recoger en almacén central</option>
                  <option>Despacho inmediato a obra</option>
                </select>
              </label>
            </div>
          </div>

          <div className="checkout-section">
            <h3 className="checkout-sec-title">4. Forma de Pago</h3>
            <div className="payment-type-selector wide">
              <button 
                type="button" 
                className={`payment-btn ${form.payment === 'Transferencia bancaria' ? 'active' : ''}`}
                onClick={() => setForm((prev) => ({ ...prev, payment: 'Transferencia bancaria' }))}
              >
                <b>Transferencia Bancaria</b>
                <span>Depósito directo a cuenta</span>
              </button>
              <button 
                type="button" 
                className={`payment-btn ${form.payment === 'Tarjeta simulada' ? 'active' : ''}`}
                onClick={() => setForm((prev) => ({ ...prev, payment: 'Tarjeta simulada' }))}
              >
                <b>Tarjeta de Crédito</b>
                <span>Simulación de pago seguro</span>
              </button>
              <button 
                type="button" 
                className={`payment-btn ${form.payment === 'PayPal / Pago Rápido' ? 'active' : ''}`}
                onClick={() => setForm((prev) => ({ ...prev, payment: 'PayPal / Pago Rápido' }))}
              >
                <b className="text-paypal-blue">PayPal / Pay Azul</b>
                <span>Pago rapido en pesos dominicanos</span>
              </button>
              <button 
                type="button" 
                className={`payment-btn ${form.payment === 'Pago contra entrega' ? 'active' : ''}`}
                onClick={() => setForm((prev) => ({ ...prev, payment: 'Pago contra entrega' }))}
              >
                <b>Pago contra Entrega</b>
                <span>Efectivo o POS al recibir</span>
              </button>
            </div>

            {form.payment === 'Tarjeta simulada' ? (
              <div className="card-simulation-fields wide">
                <div className="card-fields-header">
                  <CreditCard size={16} />
                  <span>Pasarela de Pago Simulada</span>
                </div>
                <div className="card-fields-grid">
                  <label className="checkout-label col-span-2">
                    Número de Tarjeta
                    <input 
                      value={form.cardNumber} 
                      onChange={(event) => setForm((prev) => ({ ...prev, cardNumber: event.target.value.replace(/\D/g, '').slice(0, 16) }))}
                      placeholder="4000 1234 5678 9010" 
                      required
                    />
                  </label>
                  <label className="checkout-label">
                    Expiración
                    <input 
                      value={form.cardExpiry} 
                      onChange={(event) => setForm({ ...form, cardExpiry: event.target.value })}
                      placeholder="MM/AA" 
                      required
                    />
                  </label>
                  <label className="checkout-label">
                    CVV
                    <input 
                      value={form.cardCvv} 
                      onChange={(event) => setForm({ ...form, cardCvv: event.target.value.replace(/\D/g, '').slice(0, 3) })}
                      placeholder="123" 
                      required
                    />
                  </label>
                </div>
              </div>
            ) : null}
          </div>
          
          {form.payment === 'PayPal / Pago Rápido' ? (
            <button type="submit" className="paypal-submit-btn">
              <span className="paypal-logo-text"><i>Pay</i><i>Pal</i></span>
              <span className="pay-separator">|</span>
              <span>Pagar de forma segura con Pay Azul</span>
            </button>
          ) : (
            <button type="submit" className="primary-btn checkout-submit-btn">
              <ShieldCheck size={18} /> Confirmar Compra & Emitir Factura
            </button>
          )}
        </form>
      ) : null}

      {!success && <OrderSummary totals={totals} />}

      <AnimatePresence>
        {success ? (
          <motion.div 
            className="invoice-modal-backdrop" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="invoice-container-modal" 
              initial={{ scale: 0.95, y: 30 }} 
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
            >
              <div className="invoice-actions no-print">
                <div className="invoice-success-toast">
                  <CheckCircle2 size={18} className="text-success" />
                  <span>¡Pedido Procesado! Factura Electrónica Emitida.</span>
                </div>
                <div className="action-buttons">
                  <button className="secondary print-btn" onClick={handlePrint}>
                    <Printer size={16} /> Imprimir / PDF
                  </button>
                  <button className="primary-btn" onClick={() => navigate('/pedidos')}>
                    Mis Pedidos <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* RENDER FACTURA ELECTRÓNICA REALISTA */}
              <div className="electronic-invoice-sheet" id="invoice-sheet">
                <div className="invoice-sheet-header">
                  <div className="issuer-details">
                    <div className="issuer-logo">
                      <span>EC</span>
                      <b>ElectroCables Pro S.A.</b>
                    </div>
                    <p className="issuer-sub">Importadora & Distribuidora de Materiales Eléctricos</p>
                    <p>Av. Juan Tanca Marengo #405, Guayaquil, Ecuador</p>
                    <p>Teléfono: +593 (04) 259-4000 | RUC: 1793123456001</p>
                    <p>Obligado a llevar contabilidad: SÍ</p>
                  </div>
                  
                  <div className="fiscal-details-box">
                    <div className="fiscal-header">
                      <span>FACTURA ELECTRÓNICA</span>
                      <h2>Nº {success.invoice.number}</h2>
                    </div>
                    <div className="fiscal-body">
                      <p><strong>NÚMERO DE AUTORIZACIÓN:</strong></p>
                      <p className="auth-code">{success.invoice.accessKey}</p>
                      <p><strong>FECHA Y HORA DE AUTORIZACIÓN:</strong></p>
                      <p>{new Date(success.invoice.date).toLocaleString()}</p>
                      <p><strong>AMBIENTE:</strong> PRUEBAS</p>
                      <p><strong>EMISIÓN:</strong> NORMAL</p>
                    </div>
                  </div>
                </div>

                <div className="invoice-access-key-section">
                  <div className="access-key-details">
                    <span>CLAVE DE ACCESO DEL SRI:</span>
                    <p className="access-key-digits">{success.invoice.accessKey}</p>
                  </div>
                  <div className="mock-barcode-container">
                    <div className="mock-barcode"></div>
                    <span className="barcode-caption">{success.invoice.accessKey}</span>
                  </div>
                </div>

                <div className="invoice-customer-section">
                  <div className="customer-info-grid">
                    <div>
                      <span>RAZÓN SOCIAL / CLIENTE:</span>
                      <p><strong>{success.customer.name}</strong></p>
                    </div>
                    <div>
                      <span>RUC / CÉDULA / RNC:</span>
                      <p>{success.customer.taxId}</p>
                    </div>
                    <div>
                      <span>FECHA EMISIÓN:</span>
                      <p>{new Date(success.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span>TELÉFONO:</span>
                      <p>{success.customer.phone}</p>
                    </div>
                    <div className="col-span-2">
                      <span>DIRECCIÓN:</span>
                      <p>{success.customer.address}, {success.customer.city}</p>
                    </div>
                    <div className="col-span-2">
                      <span>CORREO ELECTRÓNICO:</span>
                      <p>{success.customer.email}</p>
                    </div>
                  </div>
                </div>

                <table className="invoice-items-table">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Descripción</th>
                      <th className="text-center">Cant.</th>
                      <th className="text-right">P. Unitario</th>
                      <th className="text-right">Descuento</th>
                      <th className="text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {success.items.map((item) => {
                      const basePrice = item.price;
                      const finalPrice = item.offerPrice || item.price;
                      const discount = basePrice > finalPrice ? (basePrice - finalPrice) * item.qty : 0;
                      return (
                        <tr key={item.id}>
                          <td>{item.sku || `P-${item.id.slice(-4).toUpperCase()}`}</td>
                          <td>
                            <strong>{item.name}</strong>
                            <span className="item-meta">{item.category} | Marca: {item.brand}</span>
                          </td>
                          <td className="text-center">{item.qty}</td>
                          <td className="text-right">{money(basePrice)}</td>
                          <td className="text-right">{money(discount)}</td>
                          <td className="text-right">{money(finalPrice * item.qty)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="invoice-bottom-grid">
                  <div className="invoice-payment-info">
                    <h3>Información Adicional</h3>
                    <p><strong>Forma de Pago:</strong> {success.payment}</p>
                    <p><strong>Método de Entrega:</strong> {success.delivery}</p>
                    <p><strong>Estado del Pago:</strong> {success.payment === 'Pago contra entrega' ? 'Pendiente contra entrega' : 'Liquidado (Simulado)'}</p>
                    <div className="invoice-legal-note">
                      Este documento es una representación impresa de un comprobante electrónico simulado. No tiene validez fiscal real ante el SRI o la DGII.
                    </div>
                  </div>
                  
                  <div className="invoice-totals-box">
                    <div className="total-row">
                      <span>SUBTOTAL 0%</span>
                      <span>{money(0)}</span>
                    </div>
                    <div className="total-row">
                      <span>SUBTOTAL GRAVADO (18%)</span>
                      <span>{money(success.totals.subtotal)}</span>
                    </div>
                    <div className="total-row">
                      <span>ITBIS / IVA (18%)</span>
                      <span>{money(success.totals.taxes)}</span>
                    </div>
                    {success.totals.shipping > 0 ? (
                      <div className="total-row">
                        <span>VALOR ENVÍO</span>
                        <span>{money(success.totals.shipping)}</span>
                      </div>
                    ) : null}
                    <div className="total-row grand-total">
                      <span>TOTAL GENERAL</span>
                      <span>{money(success.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
