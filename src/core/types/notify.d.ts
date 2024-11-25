export type NotifyProps = {
	title?: string
	description?: string
}

export type NotifyOptions = {
	hasButton?: boolean
	buttonText?: string
	duration?: number
	onClick?: () => void
}

export interface Notify {
	error(error: unknown, props?: NotifyProps, config?: NotifyOptions): void
	success(props?: NotifyProps, config?: NotifyOptions): void
	info(props: NotifyProps, config?: NotifyOptions): void
}