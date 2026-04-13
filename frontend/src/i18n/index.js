import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ar from './locales/ar.json'
import fr from './locales/fr.json'

const savedLang = localStorage.getItem('sanad_lang') || 'ar'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      fr: { translation: fr },
    },
    lng: savedLang,
    fallbackLng: 'ar',
    interpolation: { escapeValue: false },
  })

export default i18n

export const setLanguage = (lang) => {
  i18n.changeLanguage(lang)
  localStorage.setItem('sanad_lang', lang)
  document.documentElement.lang = lang
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  document.body.style.fontFamily = lang === 'ar'
    ? "'Cairo', sans-serif"
    : "'Inter', sans-serif"
}
