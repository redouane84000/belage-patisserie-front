import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../../../components/Navbar/Navbar'
import Footer from '../../../components/Footer/Footer'
import patissieres from '../../../data/patissieres'
import PatissieresMobilePage from './PatissieresMobilePage'
import './PatissieresMobile.css'

export default function PatissieresMobile() {
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [searchParams] = useSearchParams()
  const idParam = Number(searchParams.get('id'))
  const highlightRef = useRef(null)

  useEffect(() => {
    if (!idParam) return
    const p = patissieres.find((x) => x.id === idParam)
    if (p) setSelectedProfile(p)
  }, [idParam])

  return (
    <div className="patissieres-mobile">
      <Navbar />
      <PatissieresMobilePage
        profiles={patissieres}
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
