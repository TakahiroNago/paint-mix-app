import { useEffect, useState } from 'react'
import type { Language } from './mixerUtils'

function readLanguage(): Language {
  try {
    const savedLanguage = window.localStorage.getItem('lang')
    if (savedLanguage === 'en' || savedLanguage === 'ja') {
      return savedLanguage
    }
  } catch (error) {
    console.warn('Could not read the saved language preference.', error)
  }

  return navigator.language.toLowerCase().startsWith('ja') ? 'ja' : 'en'
}

function readNameVisibility(): boolean {
  try {
    return window.localStorage.getItem('nameDisp') !== 'false'
  } catch (error) {
    console.warn('Could not read the saved color-name preference.', error)
    return true
  }
}

export function useMixerPreferences() {
  const [language, setLanguage] = useState<Language>(readLanguage)
  const [showNames, setShowNames] = useState(readNameVisibility)

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  function changeLanguage(nextLanguage: Language) {
    setLanguage(nextLanguage)
    try {
      window.localStorage.setItem('lang', nextLanguage)
    } catch (error) {
      console.error('Could not save the language preference.', error)
    }
  }

  function toggleNames() {
    const nextVisibility = !showNames
    setShowNames(nextVisibility)
    try {
      window.localStorage.setItem('nameDisp', String(nextVisibility))
    } catch (error) {
      console.error('Could not save the color-name preference.', error)
    }
  }

  return { language, showNames, changeLanguage, toggleNames }
}
