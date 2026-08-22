import { Check, ChevronLeft, CreditCard, Lock, Minus, Plus, ShoppingBag, Sparkles, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { FORMATION_MASTERCLASS } from '../../data/resources'
import './TrainingStore.css'

const COURSES = [
  { id: 'layer-cake', title: 'Layer Cake', price: 69.99, label: 'Les bases qui font la différence', text: 'Construisez, garnissez et lissez des layer cakes droits, stables et prêts à être vendus.', includes: ['Montage droit et régulier', 'Crèmes et garnitures stables', 'Lissage propre, finitions nettes'] },
  { id: 'flower-cupcake', title: 'Flower Cupcake', price: 69.99, label: 'Le bouquet qui se vend', text: 'Apprenez le pochage floral pour créer des cupcakes élégants, gourmands et irrésistibles.', includes: ['Gestes et pression de poche', 'Fleurs, pétales et feuillages', 'Composition d’un bouquet gourmand'] },
  { id: 'wedding-cake', title: 'Wedding Cake', price: 89.99, label: 'La pièce qui impressionne', text: 'Maîtrisez la structure et les finitions d’un wedding cake fiable, élégant et transportable.', includes: ['Supports et tiges de sécurité', 'Montage des étages', 'Transport et présentation événementielle'] },
  { id: 'payment-test', title: 'Test de paiement', price: 1, label: 'Test technique temporaire', text: 'Une commande à 1 € pour vérifier le paiement Stripe avant l’ouverture des ventes.', includes: ['Paiement réel Stripe', 'Aucun accès formation', 'À retirer après validation'] },
]
const PACKS = [
  { id: 'duo', ids: ['layer-cake', 'flower-cupcake'], title: 'Pack Douceurs Signature', saving: 19.99, note: 'Layer Cake + Flower Cupcake' },
  { id: 'trio', ids: ['layer-cake', 'flower-cupcake', 'wedding-cake'], title: 'Pack Cake Designer', saving: 49.96, note: 'Les 3 formations pour construire votre offre' },
]
const euro = (value) => value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })

export default function PacksSingle() {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('belage-training-cart') || '[]') } catch { return [] }
  })
  const [step, setStep] = useState('catalog')
  const [customer, setCustomer] = useState({ firstName: '', lastName: '', email: '', phone: '' })
  const items = useMemo(() => COURSES.filter((course) => cart.includes(course.id)), [cart])
  const total = items.reduce((sum, item) => sum + item.price, 0) - (cart.length === 2 && cart.includes('layer-cake') && cart.includes('flower-cupcake') ? 19.99 : 0) - (cart.length === 3 ? 49.96 : 0)
  const add = (ids) => setCart((current) => [...new Set([...current, ...ids])])
  useEffect(() => { localStorage.setItem('belage-training-cart', JSON.stringify(cart)) }, [cart])

  if (step === 'checkout') return <Checkout items={items} total={total} customer={customer} setCustomer={setCustomer} onBack={() => setStep('cart')} />
  return <main className="training-store">
    <header className="training-store__hero">
      <div><p>Bel Âge Pâtisserie · formations en ligne</p><h1>Apprenez. Créez.<br /><em>Vendez avec fierté.</em></h1><span>Des techniques claires et concrètes pour faire grandir votre talent, une création à la fois.</span></div>
      <button className="training-cart" onClick={() => setStep('cart')}><ShoppingBag size={18} /> Panier <b>{cart.length}</b></button>
    </header>
    {step === 'cart' ? <Cart items={items} total={total} remove={(id) => setCart((current) => current.filter((item) => item !== id))} onBack={() => setStep('catalog')} onCheckout={() => items.length && setStep('checkout')} /> : <>
      <section className="training-store__intro"><p>Les formations essentielles</p><h2>Votre savoir-faire mérite de briller.</h2><span>Choisissez une formation ou combinez-les pour créer une offre complète.</span></section>
      <section className="training-course-grid-sale">{COURSES.map((course, index) => <article key={course.id} className={`training-sale-card card-${index}`}><span className="training-sale-card__number">0{index + 1}</span><Sparkles size={22} /><p>{course.label}</p><h3>{course.title}</h3><div className="training-sale-card__price">{euro(course.price)}</div><span>{course.text}</span><ul>{course.includes.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul><button onClick={() => add([course.id])}>{cart.includes(course.id) ? 'Ajoutée au panier' : 'Ajouter au panier'} <Plus size={16} /></button></article>)}</section>
      <section className="training-packs"><div><p>Plus de technique, plus d’élan</p><h2>Les packs Bel Âge</h2></div><div className="training-pack-grid">{PACKS.map((pack) => { const regular = COURSES.filter((course) => pack.ids.includes(course.id)).reduce((sum, item) => sum + item.price, 0); return <article key={pack.id}><span>Économisez {euro(pack.saving)}</span><h3>{pack.title}</h3><p>{pack.note}</p><strong>{euro(regular - pack.saving)}</strong><small>au lieu de {euro(regular)}</small><button onClick={() => add(pack.ids)}>Choisir ce pack <Plus size={16} /></button></article> })}</div></section>
      <section className="training-masterclass"><div><p>En direct · optionnelle</p><h2>Masterclass Cake Design</h2><span>Une journée intensive en visio, avec corrections et accompagnement en direct.</span></div><div><strong>{FORMATION_MASTERCLASS.priceLabel}</strong><a href={FORMATION_MASTERCLASS.calendly} target="_blank" rel="noreferrer">Voir les créneaux</a></div></section>
    </>}
  </main>
}

function Cart({ items, total, remove, onBack, onCheckout }) { return <section className="training-checkout"><button className="training-back" onClick={onBack}><ChevronLeft size={17} /> Continuer mes achats</button><h1>Votre panier</h1>{items.length ? <><div className="training-order">{items.map((item) => <div key={item.id}><span>{item.title}</span><strong>{euro(item.price)}</strong><button aria-label={`Retirer ${item.title}`} onClick={() => remove(item.id)}><Trash2 size={17} /></button></div>)}</div><div className="training-total"><span>Total</span><strong>{euro(total)}</strong></div><button className="training-action" onClick={onCheckout}>Passer aux coordonnées <CreditCard size={17} /></button></> : <p>Votre panier est vide. Choisissez la formation qui vous ressemble.</p>}</section> }
function Checkout({ items, total, customer, setCustomer, onBack }) { const [error, setError] = useState(''); const [loading, setLoading] = useState(false); const update = (event) => setCustomer({ ...customer, [event.target.name]: event.target.value }); async function submit(event) { event.preventDefault(); setLoading(true); setError(''); try { const response = await fetch('/api/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...customer, courseIds: items.map(({ id }) => id) }) }); const body = await response.json(); if (!response.ok) throw new Error(body.error); window.location.assign(body.url) } catch (caught) { setError(caught.message || 'Le paiement ne peut pas être démarré.'); setLoading(false) } } return <section className="training-checkout"><button className="training-back" onClick={onBack}><ChevronLeft size={17} /> Retour au panier</button><p>Étape sécurisée</p><h1>Vos coordonnées</h1><form onSubmit={submit}><div className="training-fields">{[['firstName','Prénom'],['lastName','Nom'],['email','E-mail'],['phone','Téléphone']].map(([name,label]) => <label key={name}>{label}<input required name={name} type={name === 'email' ? 'email' : 'text'} value={customer[name]} onChange={update} /></label>)}</div><div className="training-total"><span>Total à régler</span><strong>{euro(total)}</strong></div><button className="training-action" disabled={loading}><Lock size={17} /> {loading ? 'Redirection sécurisée…' : 'Continuer vers le paiement sécurisé'}</button>{error && <p className="training-stripe-note">{error}</p>}</form></section> }
