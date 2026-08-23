import { Check, CheckCircle2, ChevronLeft, CreditCard, Lock, Plus, ShoppingBag, Sparkles, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { FORMATION_MASTERCLASS } from '../../data/resources'
import './TrainingStore.css'

const COURSES = [
  { id: 'layer-cake', title: 'Layer Cake', price: 69.99, label: 'Les bases qui font la différence', text: 'Construisez, garnissez et lissez des layer cakes droits, stables et prêts à être vendus.', includes: ['Montage droit et régulier', 'Crèmes et garnitures stables', 'Lissage propre, finitions nettes'] },
  { id: 'flower-cupcake', title: 'Flower Cupcake', price: 69.99, label: 'Le bouquet qui se vend', text: 'Apprenez le pochage floral pour créer des cupcakes élégants, gourmands et irrésistibles.', includes: ['Gestes et pression de poche', 'Fleurs, pétales et feuillages', 'Composition d’un bouquet gourmand'] },
  { id: 'wedding-cake', title: 'Wedding Cake', price: 89.99, label: 'La pièce qui impressionne', text: 'Maîtrisez la structure et les finitions d’un wedding cake fiable, élégant et transportable.', includes: ['Supports et tiges de sécurité', 'Montage des étages', 'Transport et présentation événementielle'] },
]
const PACKS = [
  { id: 'duo', ids: ['layer-cake', 'flower-cupcake'], title: 'Pack Douceurs Signature', price: 119.99, note: 'Layer Cake + Flower Cupcake' },
  { id: 'trio', ids: ['layer-cake', 'flower-cupcake', 'wedding-cake'], title: 'Pack Cake Designer', price: 179.99, note: 'Les 3 formations pour construire votre offre' },
]
const euro = (value) => value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })

export default function PacksSingle() {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('belage-training-cart') || '[]') } catch { return [] }
  })
  const [step, setStep] = useState('catalog')
  const [customer, setCustomer] = useState({ firstName: '', lastName: '', email: '', phone: '' })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [lastAdded, setLastAdded] = useState(null)
  const items = useMemo(() => COURSES.filter((course) => cart.includes(course.id)), [cart])
  const selectedPack = PACKS.find((pack) => pack.ids.length === cart.length && pack.ids.every((id) => cart.includes(id)))
  const total = selectedPack ? selectedPack.price : items.reduce((sum, item) => sum + item.price, 0)
  const add = (ids) => {
    setCart((current) => [...new Set([...current, ...ids])])
    const pack = PACKS.find((item) => item.ids.length === ids.length && item.ids.every((id) => ids.includes(id)))
    setLastAdded(pack ? { title: pack.title, price: pack.price } : COURSES.find((course) => course.id === ids[0]))
  }
  useEffect(() => { localStorage.setItem('belage-training-cart', JSON.stringify(cart)) }, [cart])

  if (step === 'checkout') return <Checkout items={items} total={total} customer={customer} setCustomer={setCustomer} onBack={() => setStep('catalog')} />
  return <main className="training-store">
    <header className="training-store__hero">
      <div><p>Bel Âge Pâtisserie · formations en ligne</p><h1>Apprenez. Créez.<br /><em>Vendez avec fierté.</em></h1><span>Des techniques claires et concrètes pour faire grandir votre talent, une création à la fois.</span></div>
      <button className={`training-cart ${lastAdded ? 'is-updated' : ''}`} onClick={() => setDrawerOpen(true)}><ShoppingBag size={18} /> Panier <b>{cart.length}</b></button>
    </header>
    {step === 'cart' ? <Cart items={items} total={total} remove={(id) => setCart((current) => current.filter((item) => item !== id))} onBack={() => setStep('catalog')} onCheckout={() => items.length && setStep('checkout')} /> : <>
      <section className="training-store__intro"><p>Les formations essentielles</p><h2>Votre savoir-faire mérite de briller.</h2><span>Choisissez une formation ou combinez-les pour créer une offre complète.</span></section>
      <section className="training-course-grid-sale">{COURSES.map((course, index) => <article key={course.id} className={`training-sale-card card-${index}`}><span className="training-sale-card__number">0{index + 1}</span><Sparkles size={22} /><p>{course.label}</p><h3>{course.title}</h3><div className="training-sale-card__price">{euro(course.price)}</div><span>{course.text}</span><ul>{course.includes.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul><button className={cart.includes(course.id) ? 'is-added' : ''} onClick={() => add([course.id])}>{cart.includes(course.id) ? <><CheckCircle2 size={16} /> Ajouté au panier</> : <>Ajouter au panier <Plus size={16} /></>}</button></article>)}</section>
      <section className="training-packs"><div><p>Plus de technique, plus d’élan</p><h2>Les packs Bel Âge</h2></div><div className="training-pack-grid">{PACKS.map((pack) => <article key={pack.id}><span>Tarif test temporaire</span><h3>{pack.title}</h3><p>{pack.note}</p><strong>{euro(pack.price)}</strong><button onClick={() => add(pack.ids)}>Choisir ce pack <Plus size={16} /></button></article>)}</div></section>
      <section className="training-masterclass"><div><p>En direct · optionnelle</p><h2>Masterclass Cake Design</h2><span>Une journée intensive en visio, avec corrections et accompagnement en direct.</span></div><div><strong>{FORMATION_MASTERCLASS.priceLabel}</strong><a href={FORMATION_MASTERCLASS.calendly} target="_blank" rel="noreferrer">Voir les créneaux</a></div></section>
    </>}{lastAdded && <div className="training-mini-cart"><button className="training-mini-cart__close" onClick={() => setLastAdded(null)}><X size={15} /></button><p><CheckCircle2 size={16} /> Formation ajoutée</p><strong>{lastAdded.title}</strong><span>{euro(lastAdded.price)}</span><small>Panier : {items.length} article{items.length > 1 ? 's' : ''} · {euro(total)}</small><div><button onClick={() => setDrawerOpen(true)}>Voir mon panier</button><button onClick={() => setStep('checkout')}>Commander</button></div></div>}{drawerOpen && <aside className="training-drawer"><button className="training-drawer__overlay" onClick={() => setDrawerOpen(false)} aria-label="Fermer" /><section><button className="training-drawer__close" onClick={() => setDrawerOpen(false)}><X /></button><p>Votre panier</p>{items.map((item) => <article key={item.id}><div><strong>{item.title}</strong><span>Formation vidéo</span></div><b>{euro(item.price)}</b><button onClick={() => setCart((current) => current.filter((id) => id !== item.id))}><Trash2 size={16} /></button></article>)}<div className="training-drawer__total"><span>Total</span><strong>{euro(total)}</strong></div><button className="training-action" onClick={() => { setDrawerOpen(false); setStep('checkout') }}>Passer à la commande</button></section></aside>}
  </main>
}

function Cart({ items, total, remove, onBack, onCheckout }) { return <section className="training-checkout"><button className="training-back" onClick={onBack}><ChevronLeft size={17} /> Continuer mes achats</button><h1>Votre panier</h1>{items.length ? <><div className="training-order">{items.map((item) => <div key={item.id}><span>{item.title}</span><strong>{euro(item.price)}</strong><button aria-label={`Retirer ${item.title}`} onClick={() => remove(item.id)}><Trash2 size={17} /></button></div>)}</div><div className="training-total"><span>Total</span><strong>{euro(total)}</strong></div><button className="training-action" onClick={onCheckout}>Passer aux coordonnées <CreditCard size={17} /></button></> : <p>Votre panier est vide. Choisissez la formation qui vous ressemble.</p>}</section> }
function Checkout({ items, total, customer, setCustomer, onBack }) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState({})
  const fields = [['firstName', 'Prénom', 'text'], ['lastName', 'Nom', 'text'], ['email', 'E-mail', 'email'], ['phone', 'Téléphone', 'tel']]
  const valid = (name) => name === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer[name]) : name === 'phone' ? customer[name].replace(/\D/g, '').length >= 10 : customer[name].trim().length > 0
  const update = (event) => setCustomer({ ...customer, [event.target.name]: event.target.value })
  async function submit(event) {
    event.preventDefault()
    setTouched(Object.fromEntries(fields.map(([name]) => [name, true])))
    if (fields.some(([name]) => !valid(name))) return
    setLoading(true); setError('')
    try {
      const response = await fetch('/api/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...customer, courseIds: items.map(({ id }) => id) }) })
      const body = await response.json(); if (!response.ok) throw new Error(body.error)
      window.location.assign(body.url)
    } catch (caught) { setError(caught.message || 'Le paiement ne peut pas être démarré.'); setLoading(false) }
  }
  return <main className="training-store"><section className="training-checkout training-checkout--premium"><button className="training-back" onClick={onBack}><ChevronLeft size={17} /> Retour aux formations</button><ol className="training-steps"><li className="is-done">Panier</li><li className="is-current">Informations</li><li>Paiement</li></ol><div className="training-checkout-layout"><form onSubmit={submit}><p>Étape 2 sur 3</p><h1>Vos informations</h1><span>Nous les utilisons uniquement pour votre commande et vos accès.</span><div className="training-fields">{fields.map(([name, label, type]) => <label key={name} className={touched[name] ? (valid(name) ? 'is-valid' : 'is-invalid') : ''}>{label}<input required name={name} type={type} inputMode={type === 'tel' ? 'tel' : undefined} autoComplete={name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'name'} value={customer[name]} onBlur={() => setTouched({ ...touched, [name]: true })} onChange={update} />{touched[name] && !valid(name) && <small>{name === 'email' ? 'Saisis une adresse e-mail valide.' : name === 'phone' ? 'Saisis un numéro valide.' : 'Ce champ est requis.'}</small>}</label>)}</div><button className="training-action" disabled={loading}><Lock size={17} /> {loading ? 'Préparation de votre paiement sécurisé…' : 'Procéder au paiement sécurisé'}</button><em><Lock size={13} /> Paiement sécurisé avec Stripe</em>{error && <p className="training-stripe-note">{error}</p>}</form><aside className="training-checkout-summary"><p>Votre commande</p>{items.map((item) => <div key={item.id}><span>{item.title}</span><strong>{euro(item.price)}</strong></div>)}<div className="training-total"><span>Total</span><strong>{euro(total)}</strong></div></aside></div></section></main>
}
