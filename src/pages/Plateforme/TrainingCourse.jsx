import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle2, FileText, Lightbulb, PlayCircle } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import TrainingGate from './TrainingGate'
import { TRAINING_COURSES } from '../../data/trainingCourses'
import { completeLesson, getTrainingProgress, setLastLesson } from '../../features/training/progress'
import { trainingApi } from '../../features/training/api'
import { formatChapterTime, LAYER_CAKE_CHAPTERS } from '../../data/layerCakeChapters'
import { WEDDING_CAKE_CHAPTERS } from '../../data/weddingCakeChapters'
import Playerjs from 'player.js'
import './TrainingPlatform.css'
import './LayerCakeCourse.css'

const WEDDING_CAKE_PLAYER_URL = 'https://player.mediadelivery.net/embed/734928/33250c70-8db3-4c1e-88cf-2d9a00198f17?autoplay=false&loop=false&muted=false&preload=true&responsive=true'

function VideoPlayer({ orientation, embedUrl }) {
  return (
    <div className={`training-video training-video--${orientation}`}>
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title="Formation Wedding Cake"
          allow="accelerometer; gyroscope; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <>
          <div className="training-video__placeholder">
            <PlayCircle size={42} />
            <strong>Vidéo de démonstration</strong>
            <span>La vidéo protégée sera diffusée via l’API après ajout d’un stockage privé.</span>
          </div>
          <small>Ratio prévu : {orientation === 'portrait' ? '9:16 vertical' : '16:9 horizontal'}</small>
        </>
      )}
    </div>
  )
}

function LayerCakeCourse({ user, course }) {
  const videoRef = useRef(null)
  const playerRef = useRef(null)
  const [activeChapter, setActiveChapter] = useState(0)
  const [completedChapters, setCompletedChapters] = useState([])
  const chapter = LAYER_CAKE_CHAPTERS[activeChapter]
  const progressPercent = Math.round((completedChapters.length / LAYER_CAKE_CHAPTERS.length) * 100)
  const selectChapter = (index) => {
    const next = LAYER_CAKE_CHAPTERS[index]
    setActiveChapter(index)
    setCompletedChapters((current) => [...new Set([...current, next.id])])
    playerRef.current?.setCurrentTime(next.startTime)
    playerRef.current?.play()
  }
  const syncChapter = (currentTime) => {
    const index = LAYER_CAKE_CHAPTERS.findIndex(({ startTime, endTime }) => currentTime >= startTime && currentTime < endTime)
    if (index >= 0) setActiveChapter(index)
  }
  useEffect(() => {
    if (!videoRef.current) return undefined
    const player = new Playerjs.Player(videoRef.current)
    playerRef.current = player
    player.on('timeupdate', (payload) => {
      const data = typeof payload === 'string' ? JSON.parse(payload) : payload
      if (typeof data?.seconds === 'number') syncChapter(data.seconds)
    })
    return () => { playerRef.current = null }
  }, [])
  return <div className="training-app"><Navbar /><main className="training-course"><header className="training-course__head"><Link to="/plateforme">← Tableau de bord</Link><p className="training-eyebrow">Formation vidéo · 43 min 58 s</p><h1>Création d’un Layer Cake</h1><p>{course.description}</p><div className="training-course-progress"><i style={{ width: `${progressPercent}%` }} /><span>{completedChapters.length} chapitre{completedChapters.length > 1 ? 's' : ''} sur {LAYER_CAKE_CHAPTERS.length} · {progressPercent} % terminé</span></div></header><section className="training-chapter-layout"><div><div className="training-video training-video--portrait"><iframe ref={videoRef} title="Formation Layer Cake" src="https://player.mediadelivery.net/embed/734928/8b34682b-1e84-420e-a99a-b1b49f5ae2da?autoplay=false&loop=false&muted=false&preload=true&responsive=true&playerjs=true" allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;" allowFullScreen /></div><div className="training-chapter-timeline">{LAYER_CAKE_CHAPTERS.map((item, index) => <button key={item.id} className={index === activeChapter ? 'is-current' : ''} onClick={() => selectChapter(index)}><span>{item.number}</span></button>)}</div><div className="training-chapter-content"><p className="training-eyebrow">Chapitre {activeChapter + 1} sur {LAYER_CAKE_CHAPTERS.length}</p><h2>{chapter.number} — {chapter.title}</h2><p><strong>Vidéo :</strong> {formatChapterTime(chapter.startTime)} → {formatChapterTime(chapter.endTime)}</p><div className="training-lesson__notes"><article><h3>Objectif</h3><p>{chapter.objective}</p></article><article><h3>Ingrédients / matériel</h3><ul>{chapter.ingredients.map((item) => <li key={item}>{item}</li>)}</ul></article><article><h3>Étapes</h3><ol>{chapter.steps.map((item) => <li key={item}>{item}</li>)}</ol></article><article><h3>Point important</h3><p>{chapter.warning}</p></article><article><h3>À retenir</h3><p>{chapter.takeaway}</p></article>{chapter.conclusion && <article><h3>Conclusion</h3><p>{chapter.conclusion}</p></article>}</div><div className="training-lesson__actions"><button disabled={!activeChapter} onClick={() => selectChapter(activeChapter - 1)}><ChevronLeft size={17} /> Chapitre précédent</button><button className="is-primary" onClick={() => setCompletedChapters((current) => [...new Set([...current, chapter.id])])}>{completedChapters.includes(chapter.id) ? 'Chapitre terminé' : 'Marquer comme terminé'}</button><button disabled={activeChapter === LAYER_CAKE_CHAPTERS.length - 1} onClick={() => selectChapter(activeChapter + 1)}>Chapitre suivant <ChevronRight size={17} /></button></div></div></div><aside className="training-course__sidebar"><p>Parcours du cours</p>{LAYER_CAKE_CHAPTERS.map((item, index) => <button key={item.id} className={index === activeChapter ? 'is-current' : ''} onClick={() => selectChapter(index)}><span>{item.number}</span>{item.title}<small>{formatChapterTime(item.startTime)} → {formatChapterTime(item.endTime)}</small></button>)}</aside></section></main><Footer /></div>
}

function WeddingCakeCourse({ course }) {
  const frameRef = useRef(null)
  const playerRef = useRef(null)
  const [active, setActive] = useState(0)
  const [completed, setCompleted] = useState([])
  const chapter = WEDDING_CAKE_CHAPTERS[active]
  const select = (index) => {
    const next = WEDDING_CAKE_CHAPTERS[index]
    setActive(index)
    setCompleted((current) => [...new Set([...current, next.id])])
    playerRef.current?.setCurrentTime(next.startTime)
    playerRef.current?.play()
  }
  useEffect(() => {
    const player = new Playerjs.Player(frameRef.current)
    playerRef.current = player
    player.on('timeupdate', (payload) => {
      const data = typeof payload === 'string' ? JSON.parse(payload) : payload
      const index = WEDDING_CAKE_CHAPTERS.findIndex((item) => data?.seconds >= item.startTime && data.seconds < item.endTime)
      if (index >= 0) setActive(index)
    })
    return () => { playerRef.current = null }
  }, [])
  return <div className="training-app"><Navbar /><main className="training-course"><header className="training-course__head"><Link to="/plateforme">← Tableau de bord</Link><p className="training-eyebrow">Formation vidéo · 55 min 54 s</p><h1>{course.title}</h1><p>{course.description}</p><div className="training-course-progress"><i style={{ width: `${Math.round(completed.length / WEDDING_CAKE_CHAPTERS.length * 100)}%` }} /><span>{completed.length} module{completed.length > 1 ? 's' : ''} sur {WEDDING_CAKE_CHAPTERS.length}</span></div></header><section className="training-chapter-layout"><div><div className="training-video training-video--landscape"><iframe ref={frameRef} title="Formation Wedding Cake" src={`${WEDDING_CAKE_PLAYER_URL}&playerjs=true`} allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen /></div><div className="training-chapter-timeline">{WEDDING_CAKE_CHAPTERS.map((item, index) => <button key={item.id} className={index === active ? 'is-current' : ''} onClick={() => select(index)}><span>{item.number}</span></button>)}</div><div className="training-chapter-content"><p className="training-eyebrow">Module {active + 1} sur {WEDDING_CAKE_CHAPTERS.length}</p><h2>{chapter.number} — {chapter.title}</h2><p><strong>Vidéo :</strong> {formatChapterTime(chapter.startTime)} → {formatChapterTime(chapter.endTime)}</p><div className="training-lesson__notes"><article><h3>Dans ce module</h3><p>{chapter.objective}</p></article><article><h3>À retenir</h3><p>Reprenez ce passage autant de fois que nécessaire avant de poursuivre la pièce montée.</p></article></div><div className="training-lesson__actions"><button disabled={!active} onClick={() => select(active - 1)}><ChevronLeft size={17} /> Module précédent</button><button className="is-primary" onClick={() => setCompleted((current) => [...new Set([...current, chapter.id])])}>{completed.includes(chapter.id) ? 'Module terminé' : 'Marquer comme terminé'}</button><button disabled={active === WEDDING_CAKE_CHAPTERS.length - 1} onClick={() => select(active + 1)}>Module suivant <ChevronRight size={17} /></button></div></div></div><aside className="training-course__sidebar"><p>Parcours du cours</p>{WEDDING_CAKE_CHAPTERS.map((item, index) => <button key={item.id} className={index === active ? 'is-current' : ''} onClick={() => select(index)}><span>{item.number}</span>{item.title}<small>{formatChapterTime(item.startTime)} → {formatChapterTime(item.endTime)}</small></button>)}</aside></section></main><Footer /></div>
}

function Course({ user, course }) {
  if (course.id === 'layer-cake') return <LayerCakeCourse user={user} course={course} />
  if (course.id === 'wedding-cake') return <WeddingCakeCourse course={course} />
  const lessons = useMemo(() => course.modules.flatMap((module) => module.lessons.map((lesson) => ({ ...lesson, moduleTitle: module.title }))), [course])
  const initialProgress = getTrainingProgress(user.username)
  const initialIndex = Math.max(0, lessons.findIndex((lesson) => `${course.id}:${lesson.id}` === initialProgress.lastLesson))
  const [index, setIndex] = useState(initialIndex)
  const [progress, setProgress] = useState(initialProgress)
  const lesson = lessons[index]
  const lessonKey = `${course.id}:${lesson.id}`
  const isDone = progress.completed.includes(lessonKey)

  function goTo(nextIndex) {
    const clamped = Math.max(0, Math.min(nextIndex, lessons.length - 1))
    setIndex(clamped)
    setProgress(setLastLesson(user.username, `${course.id}:${lessons[clamped].id}`))
  }

  function markDone() {
    setProgress(completeLesson(user.username, lessonKey))
  }

  return (
    <div className="training-app">
      <Navbar />
      <main className="training-course">
        <header className="training-course__head">
          <Link to="/plateforme">← Tableau de bord</Link>
          <p className="training-eyebrow">{course.eyebrow}</p>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
        </header>
        <div className="training-course__layout">
          <aside className="training-course__sidebar">
            <p>Sommaire</p>
            {course.modules.map((module) => (
              <div key={module.id}>
                <strong>{module.title}</strong>
                {module.lessons.map((item) => {
                  const itemIndex = lessons.findIndex((candidate) => candidate.id === item.id)
                  const done = progress.completed.includes(`${course.id}:${item.id}`)
                  return <button key={item.id} className={itemIndex === index ? 'is-current' : ''} onClick={() => goTo(itemIndex)}>{done && <CheckCircle2 size={14} />}{item.title}</button>
                })}
              </div>
            ))}
          </aside>
          <section className="training-lesson">
            <p className="training-eyebrow">{lesson.moduleTitle} · {lesson.duration}</p>
            <h2>{lesson.title}</h2>
            <p>{lesson.description}</p>
            <VideoPlayer orientation={course.videoOrientation} embedUrl={course.id === 'wedding-cake' ? WEDDING_CAKE_PLAYER_URL : null} />
            <div className="training-lesson__notes">
              <article><h3><FileText size={17} /> Matériel</h3><ul>{lesson.materials?.map((item) => <li key={item}>{item}</li>)}</ul></article>
              <article><h3>Ingrédients</h3><ul>{lesson.ingredients?.map((item) => <li key={item}>{item}</li>)}</ul></article>
              <article><h3><Lightbulb size={17} /> Conseil</h3><ul>{lesson.tips?.map((item) => <li key={item}>{item}</li>)}</ul></article>
              <article><h3>À éviter</h3><ul>{lesson.commonMistakes?.map((item) => <li key={item}>{item}</li>)}</ul></article>
            </div>
            <div className="training-lesson__actions">
              <button disabled={index === 0} onClick={() => goTo(index - 1)}><ChevronLeft size={17} /> Leçon précédente</button>
              <button className={isDone ? 'is-complete' : 'is-primary'} onClick={markDone}>{isDone ? <><CheckCircle2 size={17} /> Leçon terminée</> : 'Marquer comme terminée'}</button>
              <button disabled={index === lessons.length - 1} onClick={() => goTo(index + 1)}>Leçon suivante <ChevronRight size={17} /></button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function CourseLoader({ user, courseId }) {
  const [state, setState] = useState({ loading: true, course: null, error: '' })

  useEffect(() => {
    let active = true
    trainingApi.course(courseId)
      .then(({ course }) => active && setState({ loading: false, course, error: '' }))
      .catch((error) => active && setState({ loading: false, course: null, error: error.message }))
    return () => { active = false }
  }, [courseId])

  if (state.loading) return <main className="training-loading"><span /> Chargement de la formation…</main>
  if (!state.course) return <main className="training-loading">{state.error || 'Formation indisponible.'}</main>
  return <Course user={user} course={state.course} />
}

export default function TrainingCourse() {
  const { courseId } = useParams()
  const exists = TRAINING_COURSES.some((course) => course.id === courseId)
  if (!exists) return <Navigate to="/plateforme" replace />
  return <TrainingGate requiredCourse={courseId}>{(user) => <CourseLoader user={user} courseId={courseId} />}</TrainingGate>
}
