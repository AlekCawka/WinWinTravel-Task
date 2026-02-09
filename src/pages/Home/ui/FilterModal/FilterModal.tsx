import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { FiltersResponse } from '@/shared/api/getFilters'
import { FilterType } from '@/shared/api/types/Filter'
import type { SearchRequestFilter } from '@/shared/api/types/SearchRequest'
import { EMPTY_APPLIED } from '@/shared/store/filtersStore'

type FilterModalProps = {
	open: boolean
	onClose: () => void
	data: FiltersResponse['filterItems']
	initialApplied: SearchRequestFilter
	onApply: (next: SearchRequestFilter) => void
}

const buildMapFromApplied = (applied: SearchRequestFilter) => {
	const map = new Map<string, Set<string>>()

	for (const item of applied) {
		map.set(item.id, new Set(item.optionsIds))
	}

	return map
}

const buildAppliedFromMap = (
	map: Map<string, Set<string>>
): SearchRequestFilter => {
	const next: SearchRequestFilter = []

	for (const [id, set] of map.entries()) {
		if (set.size === 0) {
			continue
		}
		next.push({ id, type: FilterType.OPTION, optionsIds: Array.from(set) })
	}

	return next
}

const normalizeApplied = (applied: SearchRequestFilter) => {
	return applied
		.map(item => ({
			id: item.id,
			type: item.type,
			optionsIds: [...item.optionsIds].sort()
		}))
		.sort((leftItem, rightItem) => leftItem.id.localeCompare(rightItem.id))
}

const areAppliedEqual = (
	left: SearchRequestFilter,
	right: SearchRequestFilter
) => {
	const normalizedLeft = normalizeApplied(left)
	const normalizedRight = normalizeApplied(right)

	if (normalizedLeft.length !== normalizedRight.length) {
		return false
	}

	for (let i = 0; i < normalizedLeft.length; i++) {
		if (normalizedLeft[i].id !== normalizedRight[i].id) {
			return false
		}

		if (normalizedLeft[i].type !== normalizedRight[i].type) {
			return false
		}

		const leftOptions = normalizedLeft[i].optionsIds
		const rightOptions = normalizedRight[i].optionsIds

		if (leftOptions.length !== rightOptions.length) {
			return false
		}

		for (let j = 0; j < leftOptions.length; j++) {
			if (leftOptions[j] !== rightOptions[j]) {
				return false
			}
		}
	}

	return true
}

export const FilterModal = ({
	open,
	onClose,
	data,
	initialApplied,
	onApply
}: FilterModalProps) => {
	const initialMap = useMemo(
		() => buildMapFromApplied(initialApplied),
		[initialApplied]
	)

	const [selected, setSelected] = useState<Map<string, Set<string>>>(initialMap)

	useEffect(() => {
		if (!open) {
			return
		}

		setSelected(buildMapFromApplied(initialApplied))
	}, [open, initialApplied])

	const isChecked = (filterId: string, optionId: string) =>
		selected.get(filterId)?.has(optionId) ?? false

	const toggleOption = (filterId: string, optionId: string) => {
		setSelected(prev => {
			const next = new Map(prev)
			const set = new Set(next.get(filterId) ?? [])

			if (set.has(optionId)) {
				set.delete(optionId)
			} else {
				set.add(optionId)
			}

			if (set.size === 0) {
				next.delete(filterId)
			} else {
				next.set(filterId, set)
			}

			return next
		})
	}

	const { t } = useTranslation()

	const nextApplied = useMemo(() => buildAppliedFromMap(selected), [selected])
	const hasChanges = useMemo(
		() => !areAppliedEqual(initialApplied, nextApplied),
		[initialApplied, nextApplied]
	)

	const handleApply = () => {
		onApply(nextApplied)
		onClose()
	}

	if (!open) {
		return null
	}

	return (
		<div
			className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6 backdrop-blur"
			onClick={onClose}
			role="dialog"
			aria-modal="true"
		>
			<div
				className="bg-white w-[min(800px,92vw)] h-[min(90vh,820px)] rounded-2xl overflow-hidden"
				onClick={e => e.stopPropagation()}
			>
				<div className="grid grid-cols-[1fr_auto_1fr] items-center px-8 py-6">
					<div />
					<h2 className="text-xl font-semibold">{t('common.filterTitle')}</h2>

					<button
						type="button"
						className="justify-self-end text-2xl leading-none text-gray-500 hover:text-gray-800"
						onClick={onClose}
						aria-label="Close"
					>
						<svg
							viewBox="0 0 24 24"
							width="20"
							height="20"
							aria-hidden="true"
						>
							<path
								d="M18 6L6 18M6 6l12 12"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
							/>
						</svg>
					</button>
				</div>

				<div className="border-t border-gray-200" />

				<div className="h-[calc(100%-64px-1px-80px)] overflow-auto px-8 py-6">
					{data.map(item => (
						<section
							key={item.id}
							className="py-6"
						>
							<h3 className="text-base font-semibold text-gray-800">
								{item.name}
							</h3>

							{item.description && (
								<p className="mt-1 text-sm text-gray-500">{item.description}</p>
							)}

							<div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-3">
								{item.options.map(option => (
									<label
										key={option.id}
										className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer select-none"
									>
										<input
											type="checkbox"
											className="h-4 w-4"
											checked={isChecked(item.id, option.id)}
											onChange={() => toggleOption(item.id, option.id)}
										/>
										<span>{option.name}</span>
									</label>
								))}
							</div>

							<div className="mt-6 border-t border-gray-200" />
						</section>
					))}
				</div>

				<div className="border-t border-gray-200" />
				<div className="grid grid-cols-[1fr_auto_1fr] items-center px-8 py-5">
					<div />

					<button
						type="button"
						className="px-10 py-2 rounded-lg bg-orange-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={handleApply}
						disabled={!hasChanges}
					>
						{t('common.apply')}
					</button>

					<button
						type="button"
						className="justify-self-end text-sm text-sky-600 hover:text-sky-800"
						onClick={() => setSelected(buildMapFromApplied(EMPTY_APPLIED))}
					>
						{t('common.clearAll')}
					</button>
				</div>
			</div>
		</div>
	)
}
