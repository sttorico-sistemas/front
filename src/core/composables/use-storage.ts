import { StorageAdapter } from "@/core/adapters"

const storageInstance = new StorageAdapter()

export const useStorage = () => {
	return storageInstance;
}

