<script lang="ts" setup>
	import { Separator } from '@/core/components/separator'
	import { InputRoot } from '@/core/components/fields/input'
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
	import { useQuery } from '@tanstack/vue-query'
	import { computed, type PropType } from 'vue'
	import CheckboxTree from '@/core/components/fields/checkbox-tree/CheckboxTree.vue'
	import { iamRepository } from '@/core/stores'

	const props = defineProps({
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
		<FormField v-slot="{ componentField }" name="name">
			<FormItem class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<FormLabel class="text-left col-span-2">Nome</FormLabel>
				<FormControl>
					<input-root
						:disabled="disabled"
						type="text"
						placeholder="Digite o nome..."
						class="col-span-5"
						v-bind="componentField"
					/>
				</FormControl>

				<FormMessage class="col-span-5 col-start-3" />
			</FormItem>
		</FormField>

		<FormField v-slot="{ componentField }" name="cpf">
			<FormItem class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<FormLabel class="text-left col-span-2">CPF</FormLabel>
				<FormControl>
					<input-root
						v-maska="'###.###.###-##'"
						:disabled="disabled"
						type="text"
						placeholder="Digite o CPF..."
						class="col-span-5"
						v-bind="componentField"
					/>
				</FormControl>

				<FormMessage class="col-span-5 col-start-3" />
			</FormItem>
		</FormField>

		<FormField v-slot="{ componentField }" name="typeId">
			<FormItem class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<FormLabel class="text-left col-span-2">Tipo de operador</FormLabel>
				<FormControl>
					<SelectRoot
						class="items-start justify-start"
						:disabled="disabled || isTypeOfOperatorsLoading"
						v-bind="componentField"
						@update:model-value="handleUpdatePermissions"
					>
						<SelectTrigger class="col-span-5">
							<SelectValue placeholder="Selecione o tipo de operador..." />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Tipos de operadores:</SelectLabel>
								<SelectItem
									v-for="contactType of formattedAllTypeOperators"
									:key="contactType.id"
									:value="contactType.id.toString()"
									>{{ contactType.name }}</SelectItem
								>
							</SelectGroup>
						</SelectContent>
					</SelectRoot>
				</FormControl>

				<FormMessage class="col-span-4" />
			</FormItem>
		</FormField>
		<div class="mb-8"></div>

		<FormField v-slot="{ componentField }" name="permissions">
			<Separator class="my-4" label="Permissões" />

			<FormItem class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<CheckboxTree
					:data="formattedAllTreePermissions"
					class="col-span-12"
					:disabled="disabled || isTypeOfOperatorsLoading"
					v-model="componentField.modelValue"
				/>

				<FormMessage class="col-span-12" />
			</FormItem>
		</FormField>
	</div>
</template>
