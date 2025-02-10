<script lang="ts" setup>
	import { ref, computed, type PropType } from 'vue'
	import { useQuery } from '@tanstack/vue-query'

	import {
		FormControl,
		FormField,
		FormItem,
		FormLabel,
		FormMessage,
	} from '@/core/components/form'
	import { ButtonRoot } from '@/core/components/button'
	import { MultipleCheckboxTree } from '@/core/components/fields/checkbox-tree'
	import { InputRoot } from '@/core/components/fields/input'
	import { iamRepository } from '@/core/stores'

	const emits =  defineEmits(['on-close'])
	defineProps({
		disabled: { type: Boolean, default: () => false },
		metadata: {
			type: Object as PropType<Record<string, any>>,
			default: () => ({}),
		},
	})
	const selectValue = ref('')

	const { data: permissions } = useQuery({
		queryKey: iamRepository.getQueryKey('all-permissions'),
		queryFn: ({ signal }) => iamRepository.getPermissions({ signal }),
	})

	const { data: treePermissions, isLoading: isTreePermissionsLoading } =
		useQuery({
			queryKey: iamRepository.getQueryKey('tree-permissions'),
			queryFn: ({ signal }) => iamRepository.getTreePermissions({ signal }),
		})

	const formattedPermissions = computed(() => {
		return (permissions.value ?? []).map(({ id, relatedName }) => ({
			id: `${id}`,
			name: relatedName,
		}))
	})

	const formattedAllTreePermissions = computed(() => {
		return (treePermissions.value ?? []).map((data) => data.toList())
	})

	const formattedPermissionsMap = computed(() => {
		return Object.fromEntries(
			(permissions.value ?? []).map(({ id, relatedName }) => [id, relatedName]),
		)
	})

	function onClose() {
		emits('on-close')
	}
</script>

<template>
	<div class="flex flex-col">
		<div class="border border-primary rounded-md p-5">
			<form-field v-slot="{ componentField }" name="name">
				<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
					<form-label class="text-left col-span-2">Nome</form-label>
					<form-control>
						<input-root
							:disabled="disabled"
							type="text"
							placeholder="Digite o nome..."
							class="col-span-10"
							v-bind="componentField"
						/>
					</form-control>

					<form-message class="col-span-12 col-start-2" />
				</form-item>
			</form-field>

			<form-field v-slot="{ componentField }" name="description">
				<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
					<form-label class="text-left col-span-2">Descrição</form-label>
					<form-control>
						<input-root
							:disabled="disabled"
							type="text"
							placeholder="Digite a descrição..."
							class="col-span-10"
							v-bind="componentField"
						/>
					</form-control>

					<form-message class="col-span-12 col-start-2" />
				</form-item>
			</form-field>
		</div>

		<div class="border border-primary rounded-md p-5 mt-4">
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
						:disabled="disabled || isTreePermissionsLoading"
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
