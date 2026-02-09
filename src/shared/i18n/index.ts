import { initReactI18next } from 'react-i18next'

import i18n from 'i18next'

export * from './i18n'

const resources = {
	en: {
		translation: {
			common: {
				openFilters: 'Open filters',
				filterTitle: 'Filter',
				apply: 'Apply',
				clearAll: 'Clear all parameters',
				close: 'Close'
			},
			confirm: {
				title: 'Do you want to apply new filter',
				useOld: 'Use old filter',
				applyNew: 'Apply new filter'
			},
			status: {
				loadingFilters: 'Loading filters...',
				failedToLoadFilters: 'Failed to load filters'
			},
			debug: {
				selectedFilters: 'Selected filters (debug)'
			}
		}
	}
}

i18n.use(initReactI18next).init({
	resources,
	lng: 'en',
	fallbackLng: 'en',
	interpolation: { escapeValue: false }
})

export default i18n
