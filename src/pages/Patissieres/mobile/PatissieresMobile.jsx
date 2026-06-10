import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../../../components/Navbar/Navbar'
import Footer from '../../../components/Footer/Footer'
import PatissieresMobilePage from './PatissieresMobilePage'
import './PatissieresMobile.css'

export default function PatissieresMobile({ section, sectionId, onSectionChange }) {
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [searchParams] = useSearchParams()
  const idParam = Number(searchParams.get('id'))
  const highlightRef = useRef(null)

  useEffect(() => {
    if (!idParam) return
    const p = section.providers.find((x) => x.id === idParam)
    if (p) setSelectedProfile(p)
    else setSelectedProfile(null)
  }, [idParam, section])

  useEffect(() => {
    setSelectedProfile(null)
  }, [sectionId])

  return (
    <div className="patissieres-mobile">
      <Navbar />
      <PatissieresMobilePage
        section={section}
        sectionId={sectionId}
        onSectionChange={onSectionChange}
        profiles={section.providers}
        selectedProfile={selectedProfile}
        onOpenProfile={setSelectedProfile}
        onCloseProfile={() => setSelectedProfile(null)}
        idParam={idParam}
        highlightRef={highlightRef}
      />
      <Footer />
    </div>
  )
}
