import { create } from 'zustand'

import type { SearchRequestFilter } from '@/shared/api/types/SearchRequest'

export const EMPTY_APPLIED: SearchRequestFilter = []

type FiltersState = {
	applied: SearchRequestFilter
	setApplied: (next: SearchRequestFilter) => void
	resetApplied: () => void
}

const initialApplied: SearchRequestFilter = []

export const useFiltersStore = create<FiltersState>(set => ({
	applied: initialApplied,
	setApplied: next => set({ applied: next }),
	resetApplied: () => set({ applied: EMPTY_APPLIED })
}))
