import { useContext } from 'react'
import { LanguageContext } from '@context/LanguageContext'
// LanguageContext is a plain JS file (no component), so Fast Refresh is happy

/**
 * Primary hook for consuming language context.
 *
 * Returns:
 *  - language  : 'ar' | 'en'
 *  - isRTL     : boolean
 *  - t         : translation object for current language
 *  - toggleLanguage : () => void
 *  - setLang   : (lang: 'ar' | 'en') => void
 */
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}