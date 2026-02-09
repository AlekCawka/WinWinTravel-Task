import { useTranslation } from 'react-i18next'

type ConfirmDialogProps = {
	open: boolean
	title: string
	description?: string
	onConfirm: () => void
	onCancel: () => void
}

export const ConfirmDialog = ({
	open,
	title,
	description,
	onConfirm,
	onCancel
}: ConfirmDialogProps) => {
	const { t } = useTranslation()

	if (!open) {
		return null
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur">
			<div className="relative w-full max-w-[720px] rounded-2xl bg-white p-8 shadow-xl">
				<button
					type="button"
					aria-label={t('common.close')}
					className="absolute right-4 top-4 text-gray-400 hover:text-black"
					onClick={onCancel}
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

				<h2 className="mb-2 text-center text-xl font-semibold">{title}</h2>

				{description ? (
					<p className="mb-6 text-center text-sm text-gray-600">
						{description}
					</p>
				) : (
					<div className="mb-6" />
				)}

				<div className="flex justify-center gap-4">
					<button
						type="button"
						className="rounded-lg border px-6 py-2"
						onClick={onCancel}
					>
						{t('confirm.useOld')}
					</button>

					<button
						type="button"
						className="rounded-lg bg-orange-500 px-6 py-2 text-white"
						onClick={onConfirm}
					>
						{t('confirm.applyNew')}
					</button>
				</div>
			</div>
		</div>
	)
}
