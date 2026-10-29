import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import TrainingGate from './TrainingGate'
import LessonShell from './LessonShell'
import BunnyLessonPlayer from './BunnyLessonPlayer'
import { TRAINING_COURSES } from '../../data/trainingCourses'
import { completeLesson, getTrainingProgress, setLastLesson } from '../../features/training/progress'
import { trainingApi } from '../../features/training/api'
import { formatChapterTime, LAYER_CAKE_CHAPTERS } from '../../data/layerCakeChapters'
import { FLOWER_CUPCAKE_CHAPTERS } from '../../data/flowerCupcakeChapters'
import { WEDDING_CAKE_CHAPTERS } from '../../data/weddingCakeChapters'

function parseClock(value) {
  const match = String(value ?? '').match(/(\d{1,2}):(\d{2})/)
  return match ? Number(match[1]) * 60 + Number(match[2]) : 0
}
const LAYER_CAKE_PLAYER_URL = 'https://player.mediadelivery.net/embed/734928/8b34682b-1e84-420e-a99a-b1b49f5ae2da?autoplay=false&loop=false&muted=false&preload=true&responsive=true&playerjs=true'
const WEDDING_CAKE_PLAYER_URL = 'https://player.mediadelivery.net/embed/734928/33250c70-8db3-4c1e-88cf-2d9a00198f17?autoplay=false&loop=false&muted=false&preload=true&responsive=true&playerjs=true'
const FLOWER_CUPCAKE_PLAYER_URL = 'https://player.mediadelivery.net/embed/734928/b2449a11-4838-4292-8964-5cef6eca3e2d?autoplay=false&loop=false&muted=false&preload=true&responsive=true&playerjs=true'

function paneTitle(title, children) {
  return (
    <>
      <h3>{title}</h3>
      {children}
    </>
  )
}

function LayerCakeCourse({ course }) {
  const courseTitle = course.title
  const playerRef = useRef(null)
  const [activeChapter, setActiveChapter] = useState(0)
  const [completedChapters, setCompletedChapters] = useState([])
  const chapter = LAYER_CAKE_CHAPTERS[activeChapter]
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

  const tabs = [
    { id: 'obj', label: 'Objectif', content: paneTitle('Objectif', <p>{chapter.objective}</p>) },
    chapter.ingredients?.length ? { id: 'ing', label: 'Ingrédients', content: paneTitle('Ingrédients / matériel', <ul>{chapter.ingredients.map((item) => <li key={item}>{item}</li>)}</ul>) } : null,
    chapter.steps?.length ? { id: 'steps', label: 'Étapes', content: paneTitle('Étapes', <ol>{chapter.steps.map((item) => <li key={item}>{item}</li>)}</ol>) } : null,
    chapter.takeaway ? { id: 'take', label: 'Conseils', content: paneTitle('À retenir', <p>{chapter.takeaway}</p>) } : null,
    chapter.warning ? { id: 'warn', label: 'À éviter', content: paneTitle('Point important', <p>{chapter.warning}</p>) } : null,
    chapter.conclusion ? { id: 'end', label: 'Conclusion', content: paneTitle('Conclusion', <p>{chapter.conclusion}</p>) } : null,
  ].filter(Boolean)

  return (
    <LessonShell
      courseTitle={courseTitle}
      unitLabel="chapitre"
      chapters={LAYER_CAKE_CHAPTERS.map((item) => ({
        id: item.id,
        number: item.number,
        title: item.title,
        timeLabel: `${formatChapterTime(item.endTime - item.startTime)}`,
      }))}
      activeIndex={activeChapter}
      completedIds={completedChapters}
      onSelect={selectChapter}
      onPrev={() => selectChapter(activeChapter - 1)}
      onNext={() => selectChapter(activeChapter + 1)}
      onDone={() => setCompletedChapters((current) => [...new Set([...current, chapter.id])])}
      isDone={completedChapters.includes(chapter.id)}
      rangeLabel={`Vidéo : ${formatChapterTime(chapter.startTime)} → ${formatChapterTime(chapter.endTime)}`}
      video={(
        <BunnyLessonPlayer
          title="Formation Layer Cake"
          src={LAYER_CAKE_PLAYER_URL}
          playerRef={playerRef}
          onTimeUpdate={syncChapter}
        />
      )}
      tabs={tabs}
    />
  )
}

function WeddingCakeCourse({ course }) {
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
  const syncChapter = (seconds) => {
    const index = WEDDING_CAKE_CHAPTERS.findIndex((item) => seconds >= item.startTime && seconds < item.endTime)
    if (index >= 0) setActive(index)
  }

  const uniqueSteps = chapter.steps?.filter((item) => item && item !== chapter.objective) || []
  const tabs = [
    chapter.objective ? { id: 'obj', label: 'Objectif', content: paneTitle('Dans ce module', <p>{chapter.objective}</p>) } : null,
    uniqueSteps.length ? { id: 'steps', label: 'Étapes', content: paneTitle('Étapes', <ol>{uniqueSteps.map((item) => <li key={item}>{item}</li>)}</ol>) } : null,
    chapter.takeaway ? { id: 'take', label: 'Conseils', content: paneTitle('À retenir', <p>{chapter.takeaway}</p>) } : null,
  ].filter(Boolean)

  return (
    <LessonShell
      courseTitle={course.title}
      unitLabel="module"
      chapters={WEDDING_CAKE_CHAPTERS.map((item) => ({
        id: item.id,
        number: item.number,
        title: item.title,
        timeLabel: formatChapterTime(item.endTime - item.startTime),
      }))}
      activeIndex={active}
      completedIds={completed}
      onSelect={select}
      onPrev={() => select(active - 1)}
      onNext={() => select(active + 1)}
      onDone={() => setCompleted((current) => [...new Set([...current, chapter.id])])}
      isDone={completed.includes(chapter.id)}
      rangeLabel={`Vidéo : ${formatChapterTime(chapter.startTime)} → ${formatChapterTime(chapter.endTime)}`}
      video={(
        <BunnyLessonPlayer
          title="Formation Wedding Cake"
          src={WEDDING_CAKE_PLAYER_URL}
          playerRef={playerRef}
          onTimeUpdate={syncChapter}
        />
      )}
      tabs={tabs}
    />
  )
}

function FlowerCupcakeCourse({ user, course }) {
  const playerRef = useRef(null)
  const lessons = useMemo(
    () => course.modules.flatMap((module) => module.lessons.map((lesson) => ({ ...lesson, moduleTitle: module.title }))),
    [course],
  )
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
    const start = parseClock(FLOWER_CUPCAKE_CHAPTERS[clamped]?.startTime)
    playerRef.current?.setCurrentTime(start)
    playerRef.current?.play()
  }

  const syncChapter = (seconds) => {
    const next = FLOWER_CUPCAKE_CHAPTERS.findIndex((item, itemIndex) => {
      const start = parseClock(item.startTime)
      const end = parseClock(item.endTime) || parseClock(FLOWER_CUPCAKE_CHAPTERS[itemIndex + 1]?.startTime) || Number.POSITIVE_INFINITY
      return seconds >= start && seconds < end
    })
    if (next >= 0) setIndex((current) => (current === next ? current : next))
  }

  function markDone() {
    setProgress(completeLesson(user.username, lessonKey))
  }

  const tabs = [
    lesson.objective || lesson.description ? { id: 'obj', label: 'Objectif', content: paneTitle('Objectif', <p>{lesson.objective || lesson.description}</p>) } : null,
    Array.isArray(lesson.ingredients) && lesson.ingredients.length ? { id: 'ing', label: 'Ingrédients', content: paneTitle('Ingrédients', <ul>{lesson.ingredients.map((item) => <li key={item}>{item}</li>)}</ul>) } : null,
    Array.isArray(lesson.materials) && lesson.materials.length ? { id: 'steps', label: 'Matériel', content: paneTitle('Matériel', <ul>{lesson.materials.map((item) => <li key={item}>{item}</li>)}</ul>) } : null,
    Array.isArray(lesson.tips) && lesson.tips.length ? { id: 'take', label: 'Conseils', content: paneTitle('Conseils', <ul>{lesson.tips.map((item) => <li key={item}>{item}</li>)}</ul>) } : null,
    Array.isArray(lesson.commonMistakes) && lesson.commonMistakes.length ? { id: 'warn', label: 'À éviter', content: paneTitle('À éviter', <ul>{lesson.commonMistakes.map((item) => <li key={item}>{item}</li>)}</ul>) } : null,
  ].filter(Boolean)

  const completedIds = lessons.filter((item) => progress.completed.includes(`${course.id}:${item.id}`)).map((item) => item.id)

  return (
    <LessonShell
      courseTitle={course.title}
      unitLabel="leçon"
      chapters={lessons.map((item, lessonIndex) => ({
        id: item.id,
        number: FLOWER_CUPCAKE_CHAPTERS[lessonIndex]?.number,
        title: item.title,
        timeLabel: item.duration,
      }))}
      activeIndex={index}
      completedIds={completedIds}
      onSelect={goTo}
      onPrev={() => goTo(index - 1)}
      onNext={() => goTo(index + 1)}
      onDone={markDone}
      isDone={isDone}
      rangeLabel={lesson.duration ? `Vidéo : ${lesson.duration}` : lesson.moduleTitle}
      video={(
        <BunnyLessonPlayer
          title="Formation Flower Cupcake"
          src={FLOWER_CUPCAKE_PLAYER_URL}
          playerRef={playerRef}
          onTimeUpdate={syncChapter}
        />
      )}
      tabs={tabs}
    />
  )
}

function Course({ user, course }) {
  if (course.id === 'layer-cake') return <LayerCakeCourse course={course} />
  if (course.id === 'wedding-cake') return <WeddingCakeCourse course={course} />
  if (course.id === 'flower-cupcake') return <FlowerCupcakeCourse user={user} course={course} />
  return <main className="training-loading">Formation indisponible.</main>
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
