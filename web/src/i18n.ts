// i18n configuration for DecisionMaker
const translations = {
    en: { appName: 'DecisionMaker', description: 'Structured decision analysis with pros/cons grids' },
    de: { appName: 'DecisionMaker', description: 'Structured decision analysis with pros/cons grids (DE)' },
} as const

export type Locale = keyof typeof translations
export const defaultLocale: Locale = 'en'
export const supportedLocales = Object.keys(translations) as Locale[]

export function t(key: keyof typeof translations.en, locale: Locale = defaultLocale): string {
    return translations[locale]?.[key] ?? translations.en[key] ?? key
}

export default translations
