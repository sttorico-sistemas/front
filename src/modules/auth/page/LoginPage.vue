<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import VueCollapsible from 'vue-height-collapsible/vue3'
import axios from 'axios'
import Swal from 'sweetalert2'

// Icons
import IconCaretDown from 'src/core/components/Icons/IconCaretDown.vue'
import IconUser from 'src/core/components/Icons/IconUser.vue'
import IconLock from 'src/core/components/Icons/IconLock.vue'
import IconEye from 'src/core/components/Icons/IconEye.vue'

// Declarações e estados reativos
const typeInput = ref('password')
const accordions = reactive({
	dadosContrato: false,
})
const labelAccordion = [
	'Nunca acessou o sistema?',
	'Ainda não se conectou utilizando o CPF?',
	'Esqueceu sua senha?',
	'Não está conseguindo acessar o sistema?',
	'Termos e condições de uso do sistema',
	'Política de privacidade',
]

const cpf = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()

// Mostrar/esconder senha
const showPassword = () => {
	typeInput.value = typeInput.value === 'password' ? 'text' : 'password'
}

// Função de login com modal de loading
const login = async () => {
	try {
		errorMessage.value = ''
		Swal.fire({
			title: 'Autenticando...',
			html: 'Por favor, aguarde',
			allowOutsideClick: false,
			showConfirmButton: false,
			didOpen: () => {
				Swal.showLoading()
			}
		})

		const response = await axios.post('https://dev-02-apiv2.management.infoconsig.tec.br/api/login', {
			cpf: cpf.value,
			password: password.value
		})

		if (response.data && response.data.data.authToken) {
			localStorage.setItem('authToken', response.data.data.authToken)
			localStorage.setItem('tokenType', response.data.data.token_type)

			Swal.close()
			router.push('/')
		} else {
			throw new Error('Autenticação falhou')
		}
	} catch (error) {
		Swal.close()
		errorMessage.value = 'Login ou senha incorretos.'
		Swal.fire({
			icon: 'error',
			title: 'Erro',
			text: errorMessage.value
		})
	}
}
</script>

<template>
	<main class="w-full h-dvh grid grid-cols-1 md:grid-cols-2">
		<!-- Lado esquerdo (informações e accordion) -->
		<div class="hidden md:flex flex-col justify-center bg-primary_3-table px-8">
			<div class="ml-9">
				<img src="../../../../public/assets/logo-vazado.png" alt="Bem Vindo">
				<h2 class="text-white text-4xl font-extralight mt-5">Bem Vindo</h2>
			</div>
			<div v-for="(label, idx) in labelAccordion" :key="idx" class="mt-6">
				<button type="button" class="flex justify-between items-center gap-3 text-lg text-white"
					@click="accordions[idx] = !accordions[idx]">
					<div :class="{ 'rotate-180': accordions[idx] }">
						<IconCaretDown />
					</div>
					{{ label }}
				</button>
				<VueCollapsible :isOpen="accordions[idx]">
					<p class="text-white">Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
				</VueCollapsible>
			</div>
		</div>

		<!-- Lado direito (formulário de login) -->
		<div class="container flex flex-col justify-center items-center">
			<div class="flex flex-col items-center">
				<img src="../../../../public/assets/logo-full.png" alt="InfoConsig" class="mb-5">
				<span class="text-xl font-bold">Conecte-se ao Sistema</span>
			</div>
			<form class="mt-8 md:mt-28" @submit.prevent="login">
				<!-- Campo CPF -->
				<div class="relative mb-9">
					<span class="absolute start-0 bottom-3 text-gray-500 dark:text-gray-400">
						<IconUser class="text-[#888EA8]" />
					</span>
					<input type="text" v-model="cpf" v-maska="'###.###.###-##'" id="cpf"
						class="block py-2.5 ps-6 pe-0 w-[300px] text-xl text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-500 peer"
						placeholder=" " />
					<label for="cpf"
						class="absolute text-xl text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:start-6 peer-focus:start-0 peer-focus:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">CPF</label>
				</div>

				<!-- Campo Senha -->
				<div class="relative">
					<span class="absolute start-0 bottom-3 text-gray-500 dark:text-gray-400">
						<IconLock class="text-[#888EA8]" />
					</span>
					<input :type="typeInput" v-model="password" id="password"
						class="block py-2.5 ps-6 pe-0 w-[300px] text-xl text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-500 peer"
						placeholder=" " />
					<label for="password"
						class="absolute text-xl text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:start-6 peer-focus:start-0 peer-focus:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Senha</label>
					<span @click="showPassword" class="absolute bottom-3 right-1 cursor-pointer">
						<IconEye class="text-[#888EA8]" />
					</span>
				</div>

				<!-- Mensagem de erro -->
				<div class="text-red-500 mt-2" v-if="errorMessage">{{ errorMessage }}</div>

				<!-- Botão de login -->
				<div class="flex justify-center mt-14">
					<button type="submit" class="w-[200px] h-[38px] btn bg-primary_3-table text-white text-base rounded-full">
						ENTRAR
					</button>
				</div>
			</form>

			<!-- Esqueci minha senha -->
			<span class="mt-5 md:mt-16 text-xl font-bold text-primary_3-table">Esqueci minha senha</span>

			<!-- Redes sociais -->
			<div class="mt-5 md:mt-14 flex justify-center items-center gap-5">
				<img src="../../../../public/assets/svg/instagram.svg" alt="Instagram">
				<img src="../../../../public/assets/svg/facebook.svg" alt="Facebook">
			</div>

			<!-- Rodapé -->
			<span class="text-xs text-primary_3-table absolute bottom-3">© 2024. Sttórico Sistemas Ltda. Todos os direitos reservados.</span>
		</div>
	</main>
</template>
