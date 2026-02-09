export type FiltersResponse = {
	filterItems: Array<{
		id: string
		name: string
		description?: string
		type: 'OPTION'
		options: Array<{
			id: string
			name: string
			description?: string
		}>
	}>
}

export const getFilters = async (): Promise<FiltersResponse> => {
	const res = await fetch('/src/shared/temp/filterData.json', {
		headers: { Accept: 'application/json' }
	})

	if (!res.ok) {
		throw new Error(`Failed to load filters: ${res.status} ${res.statusText}`)
	}

	return (await res.json()) as FiltersResponse
}
