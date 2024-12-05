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
	import { Separator } from '@/core/components/separator'
	import { InputRoot } from '@/core/components/fields/input'
	import { CheckboxTree } from '@/core/components/fields/checkbox-tree'
	import { iamRepository } from '@/core/stores'

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

	const { data: typeOfOperators, isLoading: isTypeOfOperatorsLoading } =
		useQuery({
			queryKey: iamRepository.getQueryKey('type-of-operators'),
			queryFn: ({ signal }) => iamRepository.getTypeOfOperators({ signal }),
		})

	const formattedAllTreePermissions = computed(() => {
		return (treePermissions.value ?? []).map((data) => data.toList())
	})

	const formattedAllTypeOperators = computed(() => {
		return (typeOfOperators.value ?? []).map(({ id, name, permissions }) => ({
			id,
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
