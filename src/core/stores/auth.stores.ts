import { defineStore } from "pinia";
import { AuthRepository } from "@/core/repositories";
import { useNotify, useStorage } from "@/core/composables";
import { UserModel } from "@/core/models";
import { useRouter } from "vue-router";

export const authRepository = new AuthRepository()
const storage = useStorage()
const notify = useNotify()

export const authStores = defineStore('auth-stores', {
	state: () => ({
		user: {} as UserModel
	}),
	actions: {
		login: async function (body: { username: string, password: string }) {
			try {
				const response = await authRepository.login(body)
				storage.setItem('authToken', response.authToken)
				storage.setItem('tokenType', response.tokenType)
				return this.getYourself()
			} catch (error) {
				notify.error(
					error,
					{ title: 'Erro no login', description: 'Não foi possível realizar o login! Verifique suas credenciais.' },
					{ duration: 1500 },
				)
				throw error
			}
		},
		logout: function () {
			notify.info({
				title: 'Deseja sair?',
				description: 'Ao sair a sua sessão será finalizada, qualquer alteração não salva será perdida.'
			}, {
				buttonText: 'Sim, desejo.',
				hasButton: true,
				onClick: () => {
					const router = useRouter()
					storage.clear()
					router.push('login')
				},
			})
		},
		getYourself: async function () {
			try {
				const response = await authRepository.getYourself()
				this.$state.user = response
				return response
			} catch (error) {
				notify.error(
					error,
					{ title: 'Error ao carregar!', description: 'Não foi possível obter os dados do seu usuário!' },
					{ duration: 1500 },
				)
				throw error
			}
		}
	},
	getters: {
		currentUser: (state) => {
			if (Object.hasOwn(state, 'id')) {
				return state.user
			}
			return null
		}
	},
});