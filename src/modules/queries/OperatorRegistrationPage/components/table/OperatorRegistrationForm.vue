<script lang="ts" setup>
	import { useQuery } from '@tanstack/vue-query'
	import { computed, type PropType } from 'vue'

	import {
		SelectContent,
		SelectGroup,
		SelectItem,
		SelectLabel,
		SelectTrigger,
		SelectValue,
		SelectRoot,
	} from '@/core/components/fields/select'
	import {
		FormControl,
		FormField,
		FormItem,
		FormLabel,
		FormMessage,
	} from '@/core/components/form'
	import { ButtonRoot } from '@/core/components/button'
	import { InputRoot } from '@/core/components/fields/input'
	import { MultipleCheckboxTree } from '@/core/components/fields/checkbox-tree'
	import { iamRepository, personRepository } from '@/core/stores'

	defineProps({
		edited: { type: Boolean, default: () => false },
		disabled: { type: Boolean, default: () => false },
		loadCities: {
			type: Object as PropType<Record<string, any>>,
			default: () => ({}),
		},
		metadata: {
			type: Object as PropType<Record<string, any>>,
			default: () => ({}),
		},
	})
	const emits = defineEmits(['update-permissions', 'search-cpf', 'on-close'])

	const { data: treePermissions, isLoading: isTreePermissionsLoading } =
		useQuery({
			queryKey: iamRepository.getQueryKey('tree-permissions'),
			queryFn: ({ signal }) => iamRepository.getTreePermissions({ signal }),
		})

	const { data: persons, isLoading: isPersonsLoading } = useQuery({
		queryKey: personRepository.getQueryKey('persons'),
		queryFn: ({ signal }) => personRepository.getAllPersons({ signal }),
	})

	const { data: typeOfOperators, isLoading: isTypeOfOperatorsLoading } =
		useQuery({
			queryKey: iamRepository.getQueryKey('type-of-operators'),
			queryFn: ({ signal }) => iamRepository.getTypeOfOperators({ signal }),
		})

	const formattedAllTreePermissions = computed(() => {
		return (treePermissions.value ?? []).map((data) => data.toList())
	})

	const formattedAllPersons = computed(() => {
		return (persons.value ?? []).map(({ id, name }) => ({
			id: `${id}`,
			name,
		}))
	})

	const formattedAllPersonsTempMap = computed(() => {
		return Object.fromEntries(
			(persons.value ?? []).map(({ id, name }) => [id, name]),
		)
	})

	const formattedAllTypeOperators = computed(() => {
		return (typeOfOperators.value ?? []).map(({ id, name, permissions }) => ({
			id: `${id}`,
			name: name,
			permissions,
		}))
	})

	const formattedAllPermissionsMap = computed(() => {
		return Object.fromEntries(
			(typeOfOperators.value ?? []).map(({ id, permissions }) => [
				`${id}`,
				permissions,
			]),
		)
	})

	function handleUpdatePermissions(id: string) {
		const selectedPermission = formattedAllPermissionsMap.value[id]

		if (selectedPermission) {
			console.log(selectedPermission)
			emits('update-permissions', selectedPermission)
		}
	}

	function handleSearchCPF(cpf: string) {
		emits('search-cpf', cpf)
	}

	function onClose() {
		emits('on-close')
	}
</script>

<template>
	<div class="flex flex-col">
		<div class="border border-primary rounded-md p-5">
			<form-field v-slot="{ componentField }" name="cpf">
				<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
					<form-label class="text-left col-span-2">CPF</form-label>
					<form-control>
						<input-root
							v-maska="'###.###.###-##'"
							:disabled="disabled || edited"
							type="text"
							placeholder="Digite o CPF..."
							class="col-span-5"
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

					<form-message class="col-span-5 col-start-3" />
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
							class="col-span-5"
							v-bind="componentField"
						/>
					</form-control>

					<form-message class="col-span-5 col-start-3" />
				</form-item>
			</form-field>

			<form-field v-slot="{ componentField }" name="typeId">
				<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
					<form-label class="text-left col-span-2">Tipo de operador</form-label>
					<form-control>
						<select-root
							class="items-start justify-start"
							:disabled="
								disabled || isTypeOfOperatorsLoading || isTreePermissionsLoading
							"
							v-bind="componentField"
							@update:model-value="handleUpdatePermissions"
						>
							<select-Trigger class="col-span-5">
								<select-Value placeholder="Selecione o tipo de operador..." />
							</select-Trigger>
							<select-content>
								<select-group>
									<select-label>Tipos de operadores:</select-label>
									<select-item
										v-for="contactType of formattedAllTypeOperators"
										:key="contactType.id"
										:value="contactType.id.toString()"
									>
										{{ contactType.name }}
									</select-item>
								</select-group>
							</select-content>
						</select-root>
					</form-control>

					<form-message class="col-span-4" />
				</form-item>
			</form-field>
			<div class="mb-8"></div>
		</div>

		<div class="border border-primary rounded-md p-5 mt-5">
			<form-field v-slot="{ componentField, handleChange }" name="permissions">
				<form-label
					class="text-left mt-4 col-span-3 text-base text-primary font-bold"
				>
					Permissões
				</form-label>

				<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
					<multiple-checkbox-tree
						:data="formattedAllTreePermissions"
						class="col-span-12"
						:disabled="
							disabled || isTypeOfOperatorsLoading || isTreePermissionsLoading
						"
						v-model="componentField.modelValue"
						@update:model-value="
							(value) => {
								handleChange(value)
							}
						"
					/>

					<form-message class="col-span-12" />
				</form-item>
			</form-field>

			<div class="flex gap-12 justify-center">
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
