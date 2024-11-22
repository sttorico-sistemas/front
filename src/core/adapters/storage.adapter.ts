import { Storage } from "@/core/types";

export class StorageAdapter implements Storage {
	getItem(key: string): string | undefined {
		const response = localStorage.getItem(key)
		if (!response) return undefined
		return JSON.parse(response)
	}

	setItem(key: string, value: unknown): void {
		const stringified = JSON.stringify(value)
		localStorage.setItem(key, stringified)
	}

	removeItem(key: string): void {
		localStorage.removeItem(key);
	}

	clear(): void {
		localStorage.clear()
	}
}