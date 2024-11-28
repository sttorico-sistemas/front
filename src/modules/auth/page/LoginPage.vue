<script setup>
	import * as z from 'zod'

	import {
		FormControl,
		FormField,
		FormItem,
		FormLabel,
		FormMessage,
	} from '@/core/components/form'
	import { ButtonRoot } from '@/core/components/button'
	import { InputRoot } from '@/core/components/fields/input'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
	import {
		Accordion,
		AccordionContent,
		AccordionItem,
		AccordionTrigger,
	} from '@/core/components/accordion'
	import { useForm } from 'vee-validate'
	import { toTypedSchema } from '@vee-validate/zod'
	import { authStores } from '@/core/stores'
	import { ref } from 'vue'
	import { useRouter } from 'vue-router'

	const accordionItems = [
		{
			value: 'item-1',
			title: 'Nunca acessou o sistema?',
			content:
				'Cras nulla quam, consectetur vel turpis vitae, fermentum porttitor elit. Vestibulum semper vitae leo a blandit. Maecenas nec enim vitae nisi lacinia suscipit. Phasellus tellus urna, lacinia eget lectus eu, elementum convallis orci. Etiam nec blandit sem. Sed efficitur dignissim mollis. Vivamus eget iaculis quam.',
		},
		{
			value: 'item-2',
			title: 'Ainda não se conectou utilizando o CPF?',
			content:
				'Cras nulla quam, consectetur vel turpis vitae, fermentum porttitor elit. Vestibulum semper vitae leo a blandit. Maecenas nec enim vitae nisi lacinia suscipit. Phasellus tellus urna, lacinia eget lectus eu, elementum convallis orci. Etiam nec blandit sem. Sed efficitur dignissim mollis. Vivamus eget iaculis quam.',
		},
		{
			value: 'item-3',
			title: 'Esqueceu sua senha?',
			content:
				'Cras nulla quam, consectetur vel turpis vitae, fermentum porttitor elit. Vestibulum semper vitae leo a blandit. Maecenas nec enim vitae nisi lacinia suscipit. Phasellus tellus urna, lacinia eget lectus eu, elementum convallis orci. Etiam nec blandit sem. Sed efficitur dignissim mollis. Vivamus eget iaculis quam.',
		},
		{
			value: 'item-4',
			title: 'Não está conseguindo acessar o sistema?',
			content:
				'Cras nulla quam, consectetur vel turpis vitae, fermentum porttitor elit. Vestibulum semper vitae leo a blandit. Maecenas nec enim vitae nisi lacinia suscipit. Phasellus tellus urna, lacinia eget lectus eu, elementum convallis orci. Etiam nec blandit sem. Sed efficitur dignissim mollis. Vivamus eget iaculis quam.',
		},
		{
			value: 'item-5',
			title: 'Termos e condições de uso do sistema',
			content:
				'Cras nulla quam, consectetur vel turpis vitae, fermentum porttitor elit. Vestibulum semper vitae leo a blandit. Maecenas nec enim vitae nisi lacinia suscipit. Phasellus tellus urna, lacinia eget lectus eu, elementum convallis orci. Etiam nec blandit sem. Sed efficitur dignissim mollis. Vivamus eget iaculis quam.',
		},
		{
			value: 'item-6',
			title: 'Política de privacidade',
			content:
				'Cras nulla quam, consectetur vel turpis vitae, fermentum porttitor elit. Vestibulum semper vitae leo a blandit. Maecenas nec enim vitae nisi lacinia suscipit. Phasellus tellus urna, lacinia eget lectus eu, elementum convallis orci. Etiam nec blandit sem. Sed efficitur dignissim mollis. Vivamus eget iaculis quam.',
		},
	]
	const typeInput = ref('password')
	const isLoading = ref(false)
	const auth = authStores()
	const router = useRouter()

	const formSchema = z.object({
		username: z.string({ message: 'O CPF é obrigatório.' }),
		password: z.string({ message: 'A senha é obrigatório.' }),
	})

	const form = useForm({
		validationSchema: toTypedSchema(formSchema),
	})

	const onLoginSubmit = form.handleSubmit(async (values) => {
		isLoading.value = true

		try {
			await auth.login(values).then(() => {
				router.push({ name: 'dashboard' })
			})
		} catch (error) {
			console.log(`onLoginSubmit:`, error)
		} finally {
			isLoading.value = false
		}
	})

	const showPassword = () => {
		typeInput.value = typeInput.value === 'password' ? 'text' : 'password'
	}
</script>

<template>
	<main class="w-full h-dvh grid grid-cols-1 md:grid-cols-2">
		<!-- Lado esquerdo (informações e accordion) -->
		<div class="hidden md:flex flex-col justify-center bg-primary_3-table px-8">
			<div class="ml-9">
				<img src="../../../../public/assets/logo-vazado.png" alt="Bem Vindo" />
				<h2 class="text-white text-4xl font-extralight mt-5">Bem Vindo</h2>
			</div>

			<accordion type="single" class="w-full mt-6" collapsible>
				<accordion-item
					v-for="item in accordionItems"
					:key="item.value"
					:value="item.value"
					class="border-none"
				>
					<accordion-trigger
						class="text-white text-lg font-medium justify-start gap-4"
					>
						{{ item.title }}
						<template #iconLeft></template>
					</accordion-trigger>
					<accordion-content class="text-white">
						{{ item.content }}
					</accordion-content>
				</accordion-item>
			</accordion>
		</div>

		<!-- Lado direito (formulário de login) -->
		<div class="container flex flex-col justify-center items-center">
			<div class="flex flex-col items-center">
				<img
					src="../../../../public/assets/logo-full.png"
					alt="InfoConsig"
					class="mb-5"
				/>
				<span class="text-xl font-bold">Conecte-se ao Sistema</span>
			</div>

			<form
				class="flex flex-col gap-4 mt-8 md:mt-28"
				@submit.prevent="onLoginSubmit"
			>
				<form-field v-slot="{ componentField }" name="username">
					<form-item class="grid grid-cols-6 items-start gap-x-4 gap-y-1">
						<form-label class="text-left">CPF</form-label>
						<form-control>
							<div class="relative w-full max-w-sm items-center col-span-6">
								<input-root
									:disabled="isLoading"
									autocomplete="username"
									v-maska="'###.###.###-##'"
									type="text"
									placeholder="Digite o CPF..."
									class="pl-10"
									v-bind="componentField"
								/>
								<span
									class="absolute start-2 inset-y-0 flex items-center justify-center px-2"
								>
									<font-awesome-icon
										class="size-4 text-[#1384AD]"
										:icon="['far', 'user']"
									/>
								</span>
							</div>
						</form-control>

						<form-message class="col-span-6 text-left" />
					</form-item>
				</form-field>

				<form-field v-slot="{ componentField }" name="password">
					<form-item class="grid grid-cols-6 items-center gap-x-4 gap-y-1">
						<form-label class="text-left">Senha</form-label>
						<form-control>
							<div
								class="relative flex w-full max-w-sm items-center gap-1.5 col-span-6"
							>
								<input-root
									:disabled="isLoading"
									autocomplete="current-password"
									:type="typeInput"
									placeholder="Digite a senha..."
									class="pl-10"
									v-bind="componentField"
								/>

								<button-root
									variant="outline"
									:disabled="isLoading"
									type="button"
									@click="showPassword"
								>
									<font-awesome-icon
										class="size-5 text-[#805DCA]"
										:icon="[
											'far',
											typeInput === 'password' ? 'eye' : 'eye-slash',
										]"
									/>
								</button-root>

								<span
									class="absolute start-2 inset-y-0 flex items-center justify-center px-2"
								>
									<font-awesome-icon
										class="size-4 text-[#805DCA]"
										:icon="['fas', 'lock']"
									/>
								</span>
							</div>
						</form-control>

						<form-message class="col-span-6 text-left" />
					</form-item>
				</form-field>

				<button-root
					variant="default"
					type="form"
					:disabled="isLoading"
					:is-loading="isLoading"
					class="text-white text-lg font-semibold bg-primary_3-table gap-4"
				>
					Entrar
					<font-awesome-icon
						v-if="isLoading"
						:icon="['fas', 'spinner']"
						class="animate-spin"
					/>
				</button-root>
			</form>

			<!-- Esqueci minha senha -->
			<span class="mt-5 md:mt-16 text-xl font-bold text-primary_3-table"
				>Esqueci minha senha</span
			>

			<!-- Redes sociais -->
			<div class="mt-5 md:mt-14 flex justify-center items-center gap-5">
				<img
					src="../../../../public/assets/svg/instagram.svg"
					alt="Instagram"
				/>
				<img src="../../../../public/assets/svg/facebook.svg" alt="Facebook" />
			</div>

			<!-- Rodapé -->
			<span class="text-xs text-primary_3-table absolute bottom-3"
				>© 2024. Sttórico Sistemas Ltda. Todos os direitos reservados.</span
			>
		</div>
	</main>
</template>
