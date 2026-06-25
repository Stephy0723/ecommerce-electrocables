import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, ChevronRight } from 'lucide-react';
import './StoreFooter.css';

export default function StoreFooter() {
  return (
    <footer className="store-footer">
      <div className="footer-main">
        <div className="footer-column brand-col">
          <div className="footer-logo">
            <span className="logo-badge">EC</span>
            <b>ElectroCables Pro</b>
          </div>
          <p className="footer-desc">
            Distribuidora líder de materiales eléctricos residenciales, comerciales e industriales.
            Calidad garantizada con stock real disponible y facturación electrónica autorizada.
          </p>
          <div className="footer-cert">
            <ShieldCheck size={16} className="text-electric" />
            <span>Distribuidor Autorizado</span>
          </div>
        </div>

        <div className="footer-column">
          <h3>Navegación</h3>
          <ul className="footer-links">
            <li>
              <a href="/">
                <ChevronRight size={12} />
                Inicio
              </a>
            </li>
            <li>
              <a href="/catalogo">
                <ChevronRight size={12} />
                Catálogo de Productos
              </a>
            </li>
            <li>
              <a href="/favoritos">
                <ChevronRight size={12} />
                Mis Favoritos
              </a>
            </li>
            <li>
              <a href="/carrito">
                <ChevronRight size={12} />
                Carrito de Compras
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Información</h3>
          <ul className="footer-links">
            <li>
              <a href="#garantia">
                <ChevronRight size={12} />
                Políticas de Garantía
              </a>
            </li>
            <li>
              <a href="#envios">
                <ChevronRight size={12} />
                Envíos y Entregas
              </a>
            </li>
            <li>
              <a href="#terminos">
                <ChevronRight size={12} />
                Términos del Servicio
              </a>
            </li>
            <li>
              <a href="#privacidad">
                <ChevronRight size={12} />
                Políticas de Privacidad
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-column contact-col">
          <h3>Contacto & Soporte</h3>
          <div className="contact-item">
            <Phone size={16} />
            <div>
              <span>Teléfono:</span>
              <p>+593 (04) 259-4000</p>
            </div>
          </div>
          <div className="contact-item">
            <Mail size={16} />
            <div>
              <span>Email:</span>
              <p>soporte@electrocables.com</p>
            </div>
          </div>
          <div className="contact-item">
            <MapPin size={16} />
            <div>
              <span>Ubicación:</span>
              <p>Av. Juan Tanca Marengo, Guayaquil, Ecuador</p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ElectroCables Supply Store. Todos los derechos reservados. Facturación Electrónica autorizada por SRI.</p>
      </div>
    </footer>
  );
}
