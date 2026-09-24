import { Clock, MapPin, MessageCircle } from 'lucide-react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { BEL_AGE_WHATSAPP_DISPLAY, BEL_AGE_WHATSAPP_URL } from '../../data/resources'
import './Contact.css'

export default function Contact() {
  return (
    <div className="contact-page">
      <Navbar />

      <main className="contact-main">
        <section className="contact-card">
          <span className="contact-kicker">Bel Âge Pâtisserie</span>
          <h1>Contactez-nous</h1>
          <p className="contact-lead">
            Pas de formulaire : nous échangeons directement sur WhatsApp. Envoyez-nous votre date,
            votre lieu et votre nombre d’invités, nous vous répondons sous 24 h.
          </p>

          <a
            href={BEL_AGE_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-wa-btn"
          >
            <MessageCircle size={19} strokeWidth={2} />
            Écrire sur WhatsApp — {BEL_AGE_WHATSAPP_DISPLAY}
          </a>

          <ul className="contact-facts">
            <li>
              <Clock size={16} strokeWidth={1.8} />
              <div>
                <strong>Disponibilités</strong>
                <span>Lundi au samedi, 9 h – 19 h</span>
              </div>
            </li>
            <li>
              <MapPin size={16} strokeWidth={1.8} />
              <div>
                <strong>Atelier</strong>
                <span>10 rue de l’Arménie, 84000 Avignon</span>
              </div>
            </li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  )
}
