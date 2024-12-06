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
	import {
		Command,
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList,
	} from '@/core/components/command'
	import {
		Popover,
		PopoverContent,
		PopoverTrigger,
	} from '@/core/components/popover'
	import { Separator } from '@/core/components/separator'
	import { InputRoot } from '@/core/components/fields/input'
	import { ButtonRoot } from '@/core/components/button'
	import { CheckboxTree } from '@/core/components/fields/checkbox-tree'
	import { iamRepository, personRepository } from '@/core/stores'
	import { ref } from 'vue'
	import { cn } from '@/core/utils'

	const openPersonBox = ref(false)

	defineProps({
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
	const emits = defineEmits(['update-permissions'])

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
			emits(
				'update-permissions',
				selectedPermission.map(({ id, relatedName }) => ({
					id: `${id}`,
					title: relatedName,
				})),
			)
		}
	}
</script>

<template>
	<div class="flex flex-col">
		<!-- <form-field v-slot="{ componentField, handleChange }" name="userId">
			<form-item
				class="grid grid-cols-12 items-center gap-x-4 gap-y-1"
			>
				<form-label class="text-left col-span-2">Pessoa:</form-label>
				<form-control>
					<popover v-model:open="openPersonBox">
						<popover-trigger as-child>
							<button-root
								variant="outline"
								role="combobox"
								:aria-expanded="openPersonBox"
								class="flex-[3] justify-between col-span-5"
								:disabled="
									disabled ||
									isPersonsLoading ||
									formattedAllPersons.length <= 0
								"
							>
								{{
									formattedAllPersonsTempMap[componentField.modelValue] ??
									'Selecione a pessoa...'
								}}
								<font-awesome-icon
									v-if="openPersonBox"
									:icon="['fas', 'chevron-up']"
								/>
								<font-awesome-icon v-else :icon="['fas', 'chevron-down']" />
							</button-root>
						</popover-trigger>
						<popover-content class="flex-1 p-0">
							<command>
								<command-input class="h-9" placeholder="Busque a pessoa..." />
								<command-empty>Nenhuma pessoa encontrada.</command-empty>
								<command-list>
									<command-group>
										<command-item
											v-for="searchPersons in formattedAllPersons"
											:key="searchPersons.id"
											:value="searchPersons.id"
											@select="
												(ev) => {
													if (typeof ev.detail.value === 'string') {
														handleChange(ev.detail.value)
													}
													openPersonBox = false
												}
											"
										>
											{{ searchPersons.name }}
											<font-awesome-icon
												:class="
													cn(
														'ml-auto h-4 w-4',
														componentField.modelValue === searchPersons.id
															? 'opacity-100'
															: 'opacity-0',
													)
												"
												:icon="['fas', 'check']"
											/>
										</command-item>
									</command-group>
								</command-list>
							</command>
						</popover-content>
					</popover>
				</form-control>

				<form-message class="col-span-5 col-start-3" />
			</form-item>
		</form-field> -->

		<form-field v-slot="{ componentField }" name="name">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">Nome</form-label>
				<form-control>
					<input-root
						:disabled="disabled"
						type="text"
						placeholder="Digite o nome..."
						class="col-span-5"
						v-bind="componentField"
					/>
				</form-control>

				<form-message class="col-span-5 col-start-3" />
			</form-item>
		</form-field>

		<form-field v-slot="{ componentField }" name="cpf">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">CPF</form-label>
				<form-control>
					<input-root
						v-maska="'###.###.###-##'"
						:disabled="disabled"
						type="text"
						placeholder="Digite o CPF..."
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

		<form-field v-slot="{ componentField }" name="permissions">
			<separator class="my-4" label="Permissões" />

			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<checkbox-tree
					:data="formattedAllTreePermissions"
					class="col-span-12"
					:disabled="
						disabled || isTypeOfOperatorsLoading || isTreePermissionsLoading
					"
					v-model="componentField.modelValue"
				/>

				<form-message class="col-span-12" />
			</form-item>
		</form-field>
	</div>
</template>
