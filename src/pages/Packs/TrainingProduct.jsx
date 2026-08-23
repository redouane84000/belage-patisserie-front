import { Check, ChevronDown, ChevronLeft, Clock, Lock, PlayCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { trainingProductBySlug } from '../../data/trainingProducts'
import './TrainingProduct.css'

const euro = (value) => value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })

export default function TrainingProduct() {
  const { slug } = useParams()
  const product = trainingProductBySlug(slug)
  const [open, setOpen] = useState(null)
  const [added, setAdded] = useState(false)
  if (!product) return <Navigate to="/packs" replace />
  const add = () => {
    const current = JSON.parse(localStorage.getItem('belage-training-cart') || '[]')
    localStorage.setItem('belage-training-cart', JSON.stringify([...new Set([...current, product.id])]))
    setAdded(true)
  }
  return <div className="training-product"><Navbar /><main><Link className="training-product__back" to="/packs"><ChevronLeft size={17} /> Retour aux formations</Link><section className="training-product__hero"><div className="training-product__visual"><PlayCircle size={42} /><span>Visuel de formation</span></div><div><p>Formation Bel Âge</p><h1>{product.title}</h1><span>{product.shortDescription}</span><div className="training-product__meta">{product.duration && <small><Clock size={15} /> {product.duration}</small>}<small>📚 {product.modules.length || 'Programme'} module{product.modules.length > 1 ? 's' : ''}</small></div><strong>{euro(product.price)}</strong><button onClick={add}>{added ? <><Check size={17} /> Ajouté au panier</> : 'Ajouter au panier'}</button><em><Lock size={13} /> Paiement sécurisé avec Stripe · Accès après validation</em></div></section><section className="training-product__section"><h2>Ce que vous allez apprendre</h2><ul>{product.outcomes.map((item) => <li key={item}><Check size={17} />{item}</li>)}</ul></section><section className="training-product__section"><h2>Cette formation comprend</h2><div className="training-product__includes"><span>🎥 {product.duration || 'Durée à confirmer'}</span><span>📚 {product.modules.length ? `${product.modules.length} modules` : 'Programme à venir'}</span><span>🔐 Accès dans votre espace personnel</span><span>▶️ Progression par chapitres</span></div></section>{product.modules.length > 0 && <section className="training-product__section"><h2>Programme de la formation</h2><div className="training-product__program">{product.modules.map((module, index) => <article key={module.title}><button onClick={() => setOpen(open === index ? null : index)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{module.title}</strong><small>{module.duration}</small><ChevronDown className={open === index ? 'is-open' : ''} size={18} /></button>{open === index && <p>{module.description}</p>}</article>)}</div></section>}<section className="training-product__cta"><strong>{euro(product.price)}</strong><button onClick={add}>{added ? '✓ Ajouté au panier' : 'Ajouter au panier'}</button></section></main><Footer /></div>
}
