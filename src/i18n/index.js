import { ar } from './ar'
import { en } from './en'

export const translations = { ar, en }

/**
 * Get a nested translation value by dot-notation key.
 * e.g. getTranslation('ar', 'nav.home') → 'الرئيسية'
 */
export function getTranslation(language, key) {
  const keys = key.split('.')
  let value = translations[language]
  for (const k of keys) {
    if (value == null) return key
    value = value[k]
  }
  return value ?? key
}

export { ar, en }