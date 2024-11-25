import { Storage } from "@/core/types";

export class StorageAdapter implements Storage {
	private storageCache = new Map<string, any>()

	getItem(key: string): string | undefined {
		if (this.storageCache.has(key)) {
			return this.storageCache.get(key)
		}
		const response = localStorage.getItem(key)
		if (!response) return undefined
		this.storageCache.set(key, JSON.parse(response))
		return JSON.parse(response)
	}

	setItem(key: string, value: unknown): void {
		const stringified = JSON.stringify(value)
		localStorage.setItem(key, stringified)
		this.storageCache.set(key, value)
	}

	removeItem(key: string): void {
		this.storageCache.delete(key)
		localStorage.removeItem(key);
	}

	clear(): void {
		this.storageCache.clear()
		localStorage.clear()
	}
}