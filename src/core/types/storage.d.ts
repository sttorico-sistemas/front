export interface Storage {
	getItem(key: string): string | undefined
	setItem(key: string, value: unknown): void
	removeItem(key: string): void
	clear(): void
}