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

export function useMixerPreferences() {
  const [language, setLanguage] = useState<Language>(readLanguage)

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

  return { language, changeLanguage }
}
