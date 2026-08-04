import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle2, FileText, Lightbulb, PlayCircle } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import TrainingGate from './TrainingGate'
import { TRAINING_COURSES } from '../../data/trainingCourses'
import { completeLesson, getTrainingProgress, setLastLesson } from '../../features/training/progress'
import { trainingApi } from '../../features/training/api'
import './TrainingPlatform.css'

function VideoPlayer({ orientation }) {
  return (
    <div className={`training-video training-video--${orientation}`}>
      <div className="training-video__placeholder">
        <PlayCircle size={42} />
        <strong>Vidéo de démonstration</strong>
        <span>La vidéo protégée sera diffusée via l’API après ajout d’un stockage privé.</span>
      </div>
      <small>Ratio prévu : {orientation === 'portrait' ? '9:16 vertical' : '16:9 horizontal'}</small>
    </div>
  )
}

function Course({ user, course }) {
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
            <VideoPlayer orientation={course.videoOrientation} />
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
