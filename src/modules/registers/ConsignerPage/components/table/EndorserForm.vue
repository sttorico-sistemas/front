<script lang="ts" setup>
	import { ref, type PropType } from 'vue'
	import { computed } from 'vue'
	import { useQuery } from '@tanstack/vue-query'

	import { InputRoot } from '@/core/components/fields/input'
	import { ButtonRoot } from '@/core/components/button'
	import {
		FormControl,
		FormField,
		FormItem,
		FormLabel,
		FormMessage,
	} from '@/core/components/form'
	import {
		SelectContent,
		SelectGroup,
		SelectItem,
		SelectLabel,
		SelectTrigger,
		SelectValue,
		SelectRoot,
	} from '@/core/components/fields/select'
	import { auxiliaryRepository, managerRepository } from '@/core/stores'

	const emits = defineEmits(['on-close', 'set-values'])
	const props = defineProps({
		disabled: { type: Boolean, default: () => false },
		metadata: {
			type: Object as PropType<Record<string, any>>,
			default: () => ({}),
		},
	})
	const selectedManager = ref<string | undefined>(undefined)

	const { data: managersData, isLoading: isManagerLoading } = useQuery({
		enabled: true,
		queryKey: managerRepository.getQueryKey('managers'),
		queryFn: ({ signal }) =>
			managerRepository.getAllManagers({
				signal,
				params: { perPage: '27' },
			}),
	})

	const { data: endorsersData, isLoading: isEndorserLoading } = useQuery({
		enabled: true,
		queryKey: auxiliaryRepository.getQueryKey('endorsers'),
		queryFn: ({ signal }) =>
		auxiliaryRepository.getAllEndorsers({
				signal,
				params: { perPage: '27' },
			}),
	})

	const formattedAllEndorsers = computed(() => {
		return (endorsersData.value ?? []).map(
			({ id, name }) => ({
				id: `${id}`,
				name: name,
			}),
		)
	})

	const formattedAllManagers = computed(() => {
		return (managersData.value ?? []).map(
			({ id, name }) => ({
				id: `${id}`,
				name: name,
			}),
		)
	})

	const formattedAllManagersMap = computed<
		Record<number, { phone: string; cellphone: string; email: string }>
	>(() => {
		return Object.fromEntries(
			(managersData.value ?? []).map(({ id, phone, cellphone, email }) => [
				id,
				{ phone, cellphone, email },
			]),
		)
	})

	function onClose() {
		emits('on-close')
	}

	function setValues(data: {
		phone: string
		cellphone: string
		email: string
	}) {
		emits('set-values', data)
	}
</script>

<template>
	<div class="flex flex-col">
		<div class="border border-primary rounded-md p-5 pb-1">
			<form-field v-slot="{ componentField }" name="name">
				<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
					<form-label class="text-left col-span-12">Averbador</form-label>
					<form-control>
						<input-root
							:disabled="disabled"
							type="text"
							placeholder="Digite o averbador..."
							class="col-span-12"
							v-bind="componentField"
						/>
					</form-control>

					<form-message class="col-span-12" />
				</form-item>
			</form-field>

			<form-field v-slot="{ componentField }" name="endorserTypeId">
				<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
					<form-label class="text-left col-span-12">Tipo do Averbador</form-label>
					<form-control>
						<select-root
							:disabled="disabled || isManagerLoading"
							v-bind="componentField"
						>
							<select-trigger class="col-span-12">
								<select-value placeholder="Tipo do Averbador" />
							</select-trigger>
							<select-content>
								<select-group>
									<select-label>Tipo de averbadores:</select-label>
									<select-item
										v-for="endorser of formattedAllEndorsers"
										:key="endorser.id"
										:value="endorser.id.toString()"
										>{{ endorser.name }}</select-item
									>
								</select-group>
							</select-content>
						</select-root>
					</form-control>

					<form-message class="col-span-12" />
				</form-item>
			</form-field>

			<form-field v-slot="{ componentField }" name="managerId">
				<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
					<form-label class="text-left col-span-12">Gestor</form-label>
					<form-control>
						<select-root
							@update:model-value="
								(value) => {
									selectedManager = value
									setValues(formattedAllManagersMap[Number(value)])
								}
							"
							:disabled="disabled || isManagerLoading"
							v-bind="componentField"
						>
							<select-trigger class="col-span-12">
								<select-value placeholder="Gestor" />
							</select-trigger>
							<select-content>
								<select-group>
									<select-label>Gestores:</select-label>
									<select-item
										v-for="manager of formattedAllManagers"
										:key="manager.id"
										:value="manager.id.toString()"
										>{{ manager.name }}</select-item
									>
								</select-group>
							</select-content>
						</select-root>
					</form-control>

					<form-message class="col-span-12" />
				</form-item>
			</form-field>

			<form-field v-slot="{ componentField }" name="phone">
				<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
					<form-label class="text-left col-span-12">Telefone</form-label>
					<form-control>
						<input-root
							:disabled="true"
							type="text"
							v-maska="'(##) ####-####'"
							placeholder="Digite o telefone..."
							class="col-span-8 disabled:opacity-80 pointer-events-none"
							v-bind="componentField"
						/>
					</form-control>

					<form-message class="col-span-12" />
				</form-item>
			</form-field>

			<form-field v-slot="{ componentField }" name="cellphone">
				<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
					<form-label class="text-left col-span-12">Celular</form-label>
					<form-control>
						<input-root
							:disabled="true"
							type="text"
							v-maska="'(##) # ####-####'"
							placeholder="Digite o celular..."
							class="col-span-8 disabled:opacity-80 pointer-events-none"
							v-bind="componentField"
						/>
					</form-control>

					<form-message class="col-span-12" />
				</form-item>
			</form-field>

			<form-field v-slot="{ componentField }" name="email">
				<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
					<form-label class="text-left col-span-12">E-mail</form-label>
					<form-control>
						<input-root
							:disabled="true"
							type="text"
							placeholder="Digite o E-mail..."
							class="col-span-12 disabled:opacity-80 pointer-events-none"
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
					class="mt-4 gap-2 border border-primary text-primary font-semibold text-xs"
					@click="onClose"
				>
					Cancelar
				</button-root>

				<button-root
					:disabled="disabled"
					type="submit"
					class="mt-4 bg-primary text-white gap-2 font-semibold text-xs"
				>
					Salvar
				</button-root>
			</div>
		</div>
	</div>
</template>
