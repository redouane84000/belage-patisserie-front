import { ArrowLeft, ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { formatEuro, productPriceCents, selectionSummary } from '../currency'
import { useShopCart } from '../cart/cartContext'

const COLOR_SWATCHES = {
  white: '#f7f4ed', ivory: '#fff8df', cream: '#f4ddba', beige: '#d7b99c',
  black: '#1d1a18', red: '#c03642', pink: '#df9dab', blue: '#8eacc6',
  green: '#8ba28a', purple: '#a496b9', yellow: '#eac75e', gold: '#c9a84c',
  silver: '#b7bac0', brown: '#795344', orange: '#df8b43',
}

const isFlavor = (option) => option.id.includes('flavor')
const isColor = (option) => option.id.includes('color')

function colorValue(id) {
  const key = Object.keys(COLOR_SWATCHES).find((color) => id.includes(color))
  return key ? COLOR_SWATCHES[key] : null
}

function OptionGroup({ option, selectedValue, onSelect }) {
  const flavor = isFlavor(option)
  const color = isColor(option)

  return (
    <fieldset className={`shop-option ${flavor ? 'shop-option--flavors' : ''}`}>
      <legend>{option.label} {option.required && <b>Requis</b>}</legend>
      <div className={`shop-option__values ${flavor ? 'shop-option__values--flavors' : ''}`}>
        {option.values.map((value) => {
          const active = selectedValue === value.id
          const swatch = color ? colorValue(value.id) : null
          return (
            <button
              type="button"
              className={`shop-choice ${flavor ? 'shop-choice--flavor' : ''} ${active ? 'is-selected' : ''}`}
              key={value.id}
              onClick={() => onSelect(value)}
              aria-pressed={active}
            >
              {flavor && value.image && <img src={value.image} alt="" width="74" height="74" loading="lazy" />}
              {swatch && <i className="shop-choice__swatch" style={{ background: swatch }} aria-hidden="true" />}
              <span>{value.label}</span>
              {value.description && <small>{value.description}</small>}
              {value.priceCents > 0 && <em>+{formatEuro(value.priceCents)}</em>}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

function FlavorDetailModal({ detail, closing, onClose }) {
  return (
    <div className={`shop-flavor-modal-layer ${closing ? 'is-closing' : ''}`}>
      <button className="shop-flavor-modal__backdrop" onClick={onClose} aria-label="Retour aux saveurs" />
      <section className="shop-flavor-modal" role="dialog" aria-modal="true" aria-label={`Fiche de la saveur ${detail.title}`}>
        <button className="shop-flavor-modal__close" onClick={onClose} aria-label="Retour aux saveurs">
          <ArrowLeft size={17} aria-hidden="true" /> Retour au produit
        </button>
        <div className="shop-flavor-modal__media">
          <img src={detail.mainImage} alt={`Gâteau à la saveur ${detail.title}`} />
        </div>
        <div className="shop-flavor-modal__copy">
          <span>{detail.eyebrow}</span>
          <h3>{detail.title}</h3>
          <p>{detail.description}</p>
          <div className="shop-flavor-detail__composition">
            <strong>Composition</strong>
            <ul>
              {detail.composition.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function ProductConfigurator({ product, closing = false, onClose, onAdded }) {
  const { addItem } = useShopCart()
  const dialogRef = useRef(null)
  const [selected, setSelected] = useState({})
  const [flavorDetail, setFlavorDetail] = useState(null)
  const [flavorClosing, setFlavorClosing] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [customText, setCustomText] = useState('')
  const [note, setNote] = useState('')
  const [activeImage, setActiveImage] = useState(product.image)
  const [error, setError] = useState('')

  const selectedTextValue = product.options
    .filter((option) => option.id === 'inscription')
    .map((option) => option.values.find((value) => value.id === selected[option.id]))
    .find((value) => value?.id === 'your-own-inscription-write-in-notes-max-3-words')
  const needsCustomText = Boolean(selectedTextValue)
  const maxWords = needsCustomText ? 3 : 8
  const unitPriceCents = useMemo(() => productPriceCents(product, selected), [product, selected])
  const totalCents = unitPriceCents * quantity
  const activeImageIndex = Math.max(product.images.indexOf(activeImage), 0)

  const closeFlavorDetail = () => {
    if (flavorDetail && !flavorClosing) setFlavorClosing(true)
  }
  const returnToCatalog = () => {
    if (!closing) onClose()
  }

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        if (flavorDetail) closeFlavorDetail()
        else returnToCatalog()
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [flavorDetail, onClose])

  useEffect(() => {
    if (!flavorClosing) return undefined
    const timer = window.setTimeout(() => {
      setFlavorDetail(null)
      setFlavorClosing(false)
    }, 230)
    return () => window.clearTimeout(timer)
  }, [flavorClosing])

  const choose = (option, value) => {
    setSelected((current) => ({ ...current, [option.id]: value.id }))
    if (value.image) setActiveImage(value.image)
    if (value.flavorDetail) {
      setFlavorClosing(false)
      setFlavorDetail(value.flavorDetail)
    }
    setError('')
  }

  const changeImage = (direction) => {
    const next = (activeImageIndex + direction + product.images.length) % product.images.length
    setActiveImage(product.images[next])
  }

  const addToCart = () => {
    const missing = product.options.find((option) => option.required && !selected[option.id])
    if (missing) {
      setError(`Veuillez choisir : ${missing.label}.`)
      return
    }
    if (needsCustomText && !customText.trim()) {
      setError('Veuillez renseigner votre inscription.')
      return
    }

    addItem({
      productId: product.id,
      name: product.name,
      image: activeImage,
      quantity,
      unitPriceCents,
      selections: selectionSummary(product, selected),
      customText: customText.trim(),
      note: note.trim(),
    })
    onAdded()
  }

  const updateText = (value) => {
    const words = value.trim().split(/\s+/).filter(Boolean)
    if (words.length <= maxWords || value.length < customText.length) setCustomText(value)
  }

  return (
    <div className={`shop-modal-layer ${closing ? 'is-closing' : ''}`} role="presentation">
      <button type="button" className="shop-modal-backdrop" onClick={returnToCatalog} aria-label="Fermer la fiche produit" />
      <section className="shop-modal shop-modal--premium" ref={dialogRef} tabIndex="-1" role="dialog" aria-modal="true" aria-label={`Configurer ${product.name}`}>
        <button type="button" className="shop-modal__close shop-back-button" onClick={returnToCatalog} aria-label="Retour à tous les gâteaux">
          <ArrowLeft size={17} aria-hidden="true" />
          <span>Retour</span>
          <X size={18} aria-hidden="true" />
        </button>

        <div className="shop-gallery">
          <div className="shop-gallery__main">
            <img src={activeImage} alt={product.name} width="828" height="828" />
            {product.images.length > 1 && (
              <div className="shop-gallery__controls">
                <button onClick={() => changeImage(-1)} aria-label="Photo précédente"><ChevronLeft size={19} /></button>
                <button onClick={() => changeImage(1)} aria-label="Photo suivante"><ChevronRight size={19} /></button>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="shop-gallery__thumbs" aria-label="Galerie photos">
              {product.images.map((image, index) => (
                <button
                  className={image === activeImage ? 'is-active' : ''}
                  key={image}
                  onClick={() => setActiveImage(image)}
                  aria-label={`Afficher la photo ${index + 1}`}
                  aria-pressed={image === activeImage}
                >
                  <img src={image} alt="" width="96" height="96" loading={index > 3 ? 'lazy' : 'eager'} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="shop-modal__content">
          <span className="shop-kicker">Création Bel Âge Pâtisserie</span>
          <h2>{product.name}</h2>
          <div className="shop-product-price">
            <span>À partir de</span>
            <strong>{formatEuro(product.basePriceCents)}</strong>
          </div>
          {product.description && <p className="shop-modal__description">{product.description}</p>}
          <div className="shop-total-line">
            <span>Total de votre configuration</span>
            <strong>{formatEuro(unitPriceCents)}</strong>
          </div>

          <div className="shop-options">
            {product.options.map((option) => (
              <OptionGroup
                option={option}
                selectedValue={selected[option.id]}
                onSelect={(value) => choose(option, value)}
                key={option.id}
              />
            ))}
          </div>
          {needsCustomText && (
            <label className="shop-input">
              <span>Votre inscription <small>{maxWords} mots maximum</small></span>
              <input value={customText} onChange={(event) => updateText(event.target.value)} maxLength={70} placeholder="Votre texte" />
            </label>
          )}
          <label className="shop-input">
            <span>Note pour la pâtissière <small>Facultatif</small></span>
            <textarea value={note} onChange={(event) => setNote(event.target.value)} maxLength={240} placeholder="Précision sur votre commande…" rows="3" />
          </label>

          {error && <p className="shop-form-error" role="alert">{error}</p>}
          <div className="shop-configurator__actions">
            <div className="shop-stepper" aria-label="Quantité">
              <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Réduire la quantité"><Minus size={15} /></button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((value) => value + 1)} aria-label="Augmenter la quantité"><Plus size={15} /></button>
            </div>
            <button className="shop-button" onClick={addToCart}>
              <ShoppingBag size={18} /> Ajouter — {formatEuro(totalCents)}
            </button>
          </div>
        </div>
        <div className="shop-mobile-add">
          <strong>{formatEuro(totalCents)}</strong>
          <button className="shop-button" onClick={addToCart}>Ajouter au panier</button>
        </div>
      </section>
      <div className="shop-mobile-modal-controls" aria-label="Fermer la fiche produit">
        <button type="button" className="shop-back-button" onClick={returnToCatalog}>
          <ArrowLeft size={17} aria-hidden="true" />
          <span>Retour</span>
        </button>
        <button type="button" className="shop-icon-button" onClick={returnToCatalog} aria-label="Fermer la fiche produit">
          <X size={19} aria-hidden="true" />
        </button>
      </div>
      {flavorDetail && <FlavorDetailModal detail={flavorDetail} closing={flavorClosing} onClose={closeFlavorDetail} />}
    </div>
  )
}
