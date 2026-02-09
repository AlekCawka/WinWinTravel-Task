import { useQuery } from '@tanstack/react-query'

import { getFilters } from './getFilters'

export const filtersQueryKey = ['filters'] as const

export const useFiltersQuery = () => {
	return useQuery({
		queryKey: filtersQueryKey,
		queryFn: getFilters
	})
}
