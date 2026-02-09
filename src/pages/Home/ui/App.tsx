/* eslint-disable i18next/no-literal-string */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { SearchRequestFilter } from '@/shared/api/types/SearchRequest'
import { useFiltersQuery } from '@/shared/api/useFiltersQuery'
import { useFiltersStore } from '@/shared/store/filtersStore'

import { ConfirmDialog } from './ConfirmDialog/ConfirmDialog'
import { FilterModal } from './FilterModal/FilterModal'

export const App = () => {
	const [pendingApplied, setPendingApplied] =
		useState<SearchRequestFilter | null>(null)
	const [isConfirmOpen, setIsConfirmOpen] = useState(false)
	const { data, isLoading, error } = useFiltersQuery()
	const [isOpen, setIsOpen] = useState(false)
	const applied = useFiltersStore(state => state.applied)
	const setApplied = useFiltersStore(state => state.setApplied)
	const { t } = useTranslation()

	return (
		<section className="min-h-dvh bg-white">
			<div className="mx-auto max-w-6xl px-6 py-16">
				<div className="grid gap-10 lg:grid-cols-2 lg:items-center">
					<div className="space-y-6">
						<h1 className="text-6xl font-light leading-[1.05] text-gray-700">
							WinWinTravel
							<br />
							frontend test
							<br />
							task
						</h1>
					</div>

					<div className="space-y-4">
						<div className="flex items-center gap-4">
							<button
								type="button"
								className="rounded-xl bg-black px-6 py-3 text-white"
								onClick={() => setIsOpen(true)}
							>
								{t('common.openFilters')}
							</button>

							<div className="text-sm text-gray-500">
								{isLoading ? 'Loading filters…' : null}
								{error ? 'Failed to load filters' : null}
							</div>
						</div>

						<pre className="max-h-[420px] w-full overflow-auto rounded-xl bg-gray-100 p-4 text-sm">
							{JSON.stringify(applied, null, 2)}
						</pre>
					</div>
				</div>

				<FilterModal
					open={isOpen}
					onClose={() => setIsOpen(false)}
					data={data?.filterItems ?? []}
					initialApplied={applied}
					onApply={next => {
						setPendingApplied(next)
						setIsConfirmOpen(true)
					}}
				/>

				<ConfirmDialog
					open={isConfirmOpen}
					title="Do you want to apply new filter?"
					description="If you cancel, the previously applied filter will stay."
					onCancel={() => {
						setIsConfirmOpen(false)
						setPendingApplied(null)
					}}
					onConfirm={() => {
						if (pendingApplied) {
							setApplied(pendingApplied)
						}
						setIsConfirmOpen(false)
						setPendingApplied(null)
					}}
				/>
			</div>
		</section>
	)
}
