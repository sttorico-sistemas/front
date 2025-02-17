<script lang="ts" setup>
	import { type PropType } from 'vue'

	import { InputRoot } from '@/core/components/fields/input'
	import { ButtonRoot } from '@/core/components/button'
	import {
		FormControl,
		FormField,
		FormItem,
		FormLabel,
		FormMessage,
	} from '@/core/components/form'

	const emits = defineEmits(['on-close', 'search-cpf'])
	const props = defineProps({
		edited: { type: Boolean, default: () => false },
		disabled: { type: Boolean, default: () => false },
		metadata: {
			type: Object as PropType<Record<string, any>>,
			default: () => ({}),
		},
	})

	function onClose() {
		emits('on-close')
	}

	function handleSearchCPF(cpf: string) {
		emits('search-cpf', cpf)
	}
</script>

<template>
	<div class="flex flex-col">
		<div class="border border-primary rounded-md p-5 pb-1">
			<form-field v-slot="{ componentField }" name="cpf" v-if="!edited">
				<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
					<form-label class="text-left col-span-12">CPF</form-label>
					<form-control>
						<input-root
							v-maska="'###.###.###-##'"
							:disabled="disabled || edited"
							type="text"
							placeholder="Digite o CPF..."
							class="col-span-12"
							v-bind="componentField"
							@blur="
								(e: Event) => {
									if (!handleSearchCPF) return
									const inputValue = (e.target as any).value
									handleSearchCPF(inputValue)
								}
							"
						/>
					</form-control>

					<form-message class="col-span-12" />
				</form-item>
			</form-field>

			<form-field v-slot="{ componentField }" name="name">
				<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
					<form-label class="text-left col-span-2">Nome</form-label>
					<form-control>
						<input-root
							:disabled="true"
							type="text"
							placeholder="Digite o nome..."
							class="col-span-12"
							v-bind="componentField"
						/>
					</form-control>

					<form-message class="col-span-12" />
				</form-item>
			</form-field>

			<form-field v-slot="{ componentField }" name="position">
				<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
					<form-label class="text-left col-span-2">Função</form-label>
					<form-control>
						<input-root
							:disabled="disabled"
							type="text"
							placeholder="Digite o função..."
							class="col-span-12"
							v-bind="componentField"
						/>
					</form-control>

					<form-message class="col-span-8" />
				</form-item>
			</form-field>

			<form-field v-slot="{ componentField }" name="department">
				<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
					<form-label class="text-left col-span-2">Departamento</form-label>
					<form-control>
						<input-root
							:disabled="disabled"
							type="text"
							placeholder="Digite o departamento..."
							class="col-span-12"
							v-bind="componentField"
						/>
					</form-control>

					<form-message class="col-span-10" />
				</form-item>
			</form-field>

			<form-field v-slot="{ componentField }" name="phone">
				<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
					<form-label class="text-left col-span-2">Telefone</form-label>
					<form-control>
						<input-root
							:disabled="true"
							type="text"
							v-maska="'(##) ####-####'"
							placeholder="Digite o telefone..."
							class="col-span-12"
							v-bind="componentField"
						/>
					</form-control>

					<form-message class="col-span-8" />
				</form-item>
			</form-field>

			<form-field v-slot="{ componentField }" name="cellphone">
				<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
					<form-label class="text-left col-span-2">Celular</form-label>
					<form-control>
						<input-root
							:disabled="true"
							type="text"
							v-maska="'(##) # ####-####'"
							placeholder="Digite o celular..."
							class="col-span-12"
							v-bind="componentField"
						/>
					</form-control>

					<form-message class="col-span-8" />
				</form-item>
			</form-field>

			<form-field v-slot="{ componentField }" name="email">
				<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
					<form-label class="text-left col-span-2">E-mail</form-label>
					<form-control>
						<input-root
							:disabled="true"
							type="text"
							placeholder="Digite o e-mail..."
							class="col-span-12"
							v-bind="componentField"
						/>
					</form-control>

					<form-message class="col-span-12" />
				</form-item>
			</form-field>

			<div class="flex gap-12 justify-center -mt-4 mb-4">
				<button-root
					:disabled="disabled"
					type="button"
					variant="outline"
					class="mt-4 gap-2 w-24 border border-primary text-primary font-semibold text-xs"
					@click="onClose"
				>
					Cancelar
				</button-root>

				<button-root
					:disabled="disabled"
					type="submit"
					class="mt-4 bg-primary w-24 text-white gap-2 font-semibold text-xs"
				>
					Salvar
				</button-root>
			</div>
		</div>
	</div>
</template>
