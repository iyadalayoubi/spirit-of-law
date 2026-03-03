import { useState, useEffect, useCallback } from 'react'
import { LanguageContext } from './LanguageContext'
import { ar } from '@i18n/ar'
import { en } from '@i18n/en'

const translations = { ar, en }

export function LanguageProvider({ children }) {
  // Arabic is the default language
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('sol-language') || 'ar'
  })

  const isRTL = language === 'ar'
  const t = translations[language]

  // Sync <html> attributes whenever language changes
  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.setAttribute('data-lang', language)
    localStorage.setItem('sol-language', language)
  }, [language, isRTL])

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => (prev === 'ar' ? 'en' : 'ar'))
  }, [])

  const setLang = useCallback((lang) => {
    if (lang === 'ar' || lang === 'en') setLanguage(lang)
  }, [])

  return (
    <LanguageContext.Provider value={{ language, isRTL, t, toggleLanguage, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}