import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  blankDraft,
  loadCreations,
  loadLibrary,
  loadSettings,
  saveCreations,
  saveLibrary,
  saveSettings,
} from './storage'

const CalculatorContext = createContext(null)

export function CalculatorProvider({ children }) {
  const [settings, setSettingsState] = useState(loadSettings)
  const [library, setLibraryState] = useState(loadLibrary)
  const [creations, setCreationsState] = useState(loadCreations)
  const [toastMsg, setToastMsg] = useState('')

  const setSettings = useCallback((patch) => {
    setSettingsState((prev) => {
      const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch }
      saveSettings(next)
      return next
    })
  }, [])

  const setLibrary = useCallback((updater) => {
    setLibraryState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveLibrary(next)
      return next
    })
  }, [])

  const setCreations = useCallback((updater) => {
    setCreationsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveCreations(next)
      return next
    })
  }, [])

  const toast = useCallback((msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2200)
  }, [])

  const newDraft = useCallback(() => blankDraft(settings), [settings])

  const value = useMemo(
    () => ({
      settings,
      setSettings,
      library,
      setLibrary,
      creations,
      setCreations,
      toast,
      toastMsg,
      newDraft,
    }),
    [settings, setSettings, library, setLibrary, creations, setCreations, toast, toastMsg, newDraft],
  )

  return <CalculatorContext.Provider value={value}>{children}</CalculatorContext.Provider>
}

export function useCalculatorStore() {
  const ctx = useContext(CalculatorContext)
  if (!ctx) throw new Error('useCalculatorStore requires CalculatorProvider')
  return ctx
}
