import type { Router } from 'vue-router'

import { AxiosHttpClientAdapter } from "@/core/adapters"
import { useNotify } from "@/core/composables/use-notify";
import type { Notify, Storage } from "@/core/types";


const instance = AxiosHttpClientAdapter.createInstance({
	baseUrl: import.meta.env.VITE_BASE_URL
})

export function injectRouter(router: Router) {
	instance.router = router
}

export function injectNotify(router: Notify) {
	instance.notify = useNotify()
}

export function injectStorage(storage: Storage) {
	instance.storage = storage
}

export const useAxios = () => {
	return instance;
}

