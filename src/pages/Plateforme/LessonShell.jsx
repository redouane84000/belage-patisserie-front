import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import IconSprite, { Ico } from '../../components/refonte/IconSprite'

export default function LessonShell({
  courseTitle,
  unitLabel,
  chapters,
  activeIndex,
  completedIds,
  onSelect,
  onPrev,
  onNext,
  onDone,
  isDone,
  rangeLabel,
  video,
  tabs,
}) {
  const [tab, setTab] = useState(tabs[0]?.id || 'obj')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setTab(tabs[0]?.id || 'obj')
  }, [activeIndex])
  const current = chapters[activeIndex]
  const total = chapters.length
  const doneCount = completedIds.length
  const percent = total ? Math.round((doneCount / total) * 100) : 0
  const activeTab = tabs.find((item) => item.id === tab) || tabs[0]

  function go(index) {
    onSelect(index)
    setOpen(false)
  }

  return (
    <div className="bl page-app page-lesson">
      <IconSprite />
      <header className="hdr hdr--bar only-d">
        <Link className="logo" to="/" aria-label="BEL'ÂGE Pâtisserie — accueil" />
        <nav className="nav" aria-label="Navigation principale">
          <Link to="/packs">Nos formations</Link>
          <Link className="is-active" to="/plateforme">Plateforme de formation</Link>
        </nav>
        <div className="hdr-r">
          <Link className="btn btn--login" to="/plateforme">Tableau de bord</Link>
        </div>
      </header>

      <header className="le-mhead">
        <Link to="/plateforme" aria-label="Retour au tableau de bord"><Ico name="i-back" /></Link>
        <strong>{courseTitle}</strong>
        <button
          type="button"
          aria-controls="sommaire"
          aria-expanded={open}
          aria-label="Ouvrir le sommaire"
          onClick={() => setOpen(true)}
        >
          <Ico name="i-list" />
        </button>
      </header>

      <div className="le-shell">
        <div className="le-panel">
          <aside className={`le-side${open ? ' is-open' : ''}`} id="sommaire" aria-label="Sommaire du cours">
            <p className="le-kick">Sommaire</p>
            <p className="le-course">{courseTitle}</p>
            <div className="le-prog">
              <span>{doneCount} {unitLabel}{doneCount > 1 ? 's' : ''} sur {total} · {percent} %</span>
              <div className="ac-bar" aria-hidden="true"><i style={{ width: `${percent}%` }} /></div>
            </div>
            <div className="le-list">
              {chapters.map((chapter, index) => {
                const done = completedIds.includes(chapter.id)
                const currentItem = index === activeIndex
                return (
                  <button
                    type="button"
                    key={chapter.id}
                    className={`le-item${currentItem ? ' is-current' : ''}${done && !currentItem ? ' is-done' : ''}`}
                    aria-current={currentItem ? 'step' : undefined}
                    onClick={() => go(index)}
                  >
                    <span className="num">{done && !currentItem ? '✓' : index + 1}</span>
                    <span>{chapter.title}</span>
                    {chapter.timeLabel && <span className="tm">{chapter.timeLabel}</span>}
                  </button>
                )
              })}
            </div>
          </aside>

          <section className="le-main" aria-live="polite">
            <p className="le-crumb">
              <b className="crs">{courseTitle}</b> <span className="sep">/</span>{' '}
              <span>{unitLabel === 'module' ? 'Module' : 'Chapitre'} {activeIndex + 1} sur {total}</span>
            </p>
            <h1 className="le-title">{current.number ? `${current.number} — ` : ''}{current.title}</h1>
            {rangeLabel && <p className="le-range">{rangeLabel}</p>}
            {video}

            {tabs.length > 0 && (
              <>
                <div className="le-tabs" role="tablist" aria-label="Supports du chapitre">
                  {tabs.map((item) => (
                    <button
                      key={item.id}
                      role="tab"
                      type="button"
                      aria-selected={item.id === activeTab?.id}
                      onClick={() => setTab(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <div className="le-pane" role="tabpanel">{activeTab?.content}</div>
                <div className="le-mcards">
                  {tabs.map((item) => (
                    <article key={item.id}>{item.content}</article>
                  ))}
                </div>
              </>
            )}
          </section>

          <div className="le-actions">
            <button className="ghost prev" type="button" disabled={activeIndex === 0} onClick={onPrev}>
              <Ico name="i-left" />
              <span className="lbl-d">{unitLabel === 'module' ? 'Module précédent' : 'Chapitre précédent'}</span>
              <span className="lbl-m">Précédent</span>
            </button>
            <button className={`btn btn--bx${isDone ? ' is-done' : ''}`} type="button" onClick={onDone}>
              <span>{isDone ? `${unitLabel === 'leçon' ? 'Leçon' : unitLabel === 'module' ? 'Module' : 'Chapitre'} terminé` : 'Marquer comme terminé'}</span>
              <span className="ok" aria-hidden="true"><Ico name="i-ok" /></span>
            </button>
            <button className="ghost next" type="button" disabled={activeIndex === total - 1} onClick={onNext}>
              <span className="lbl-d">{unitLabel === 'module' ? 'Module suivant' : 'Chapitre suivant'}</span>
              <span className="lbl-m">Suivant</span>
              <Ico name="i-arrow" />
            </button>
          </div>
        </div>
      </div>
      <div className={`le-scrim${open ? ' is-open' : ''}`} onClick={() => setOpen(false)} />
    </div>
  )
}
