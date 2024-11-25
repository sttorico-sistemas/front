import { NotifyAdapter } from "@/core/adapters"

const notifyInstance = new NotifyAdapter()

export const useNotify = () => {
	return notifyInstance;
}

