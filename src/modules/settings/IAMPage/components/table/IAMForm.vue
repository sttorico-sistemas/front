<script lang="ts" setup>
	import { ref, computed, type PropType } from 'vue'
	import { useQuery } from '@tanstack/vue-query'

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
		TagsInput,
		TagsInputItem,
		TagsInputItemDelete,
		TagsInputItemText,
	} from '@/core/components/tags-input'
	import {
		FormControl,
		FormField,
		FormItem,
		FormLabel,
		FormMessage,
	} from '@/core/components/form'
	import { InputRoot } from '@/core/components/fields/input'
	import { iamRepository } from '@/core/stores'

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

	const formattedPermissions = computed(() => {
		return (permissions.value ?? []).map(({ id, relatedName }) => ({
			id: `${id}`,
			name: relatedName,
		}))
	})

	const formattedPermissionsMap = computed(() => {
		return Object.fromEntries(
			(permissions.value ?? []).map(({ id, relatedName }) => [id, relatedName]),
		)
	})
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

		<form-field
			v-slot="{ componentField, handleInput, value }"
			name="permissions"
		>
		<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
			<form-label class="text-left col-span-2">Permissões</form-label>
				<form-control>
					<tags-input
						v-model="componentField.modelValue"
						class="col-span-10 flex-col"
						:disabled="disabled"
						:displayValue="
							(value) => {
								return formattedPermissionsMap[value as string]
							}
						"
					>
						<select-root
							:disabled="disabled"
							v-model="selectValue"
							@update:modelValue="
								(data) => {
									const dataInput = value ? value : []
									handleInput([...dataInput, data])
									selectValue = ''
								}
							"
						>
							<select-trigger class="col-span-3 ">
								<select-value placeholder="Selecione uma permissão..." />
							</select-trigger>
							<select-content>
								<select-group>
									<select-label>Permissões:</select-label>
									<select-item
										v-for="permission of formattedPermissions"
										:disabled="
											((value as any[]) ?? []).some(
												(value) => value === permission.id,
											)
										"
										:key="permission.id"
										:value="permission.id"
									>
										{{ permission.name }}
									</select-item>
								</select-group>
							</select-content>
						</select-root>

						<div
							class="flex flex-wrap w-full gap-2 items-start justify-start px-3 py-2 text-sm"
						>
							<tags-input-item v-for="item in value" :key="item" :value="item">
								<tags-input-item-text />
								<tags-input-item-delete />
							</tags-input-item>
						</div>
					</tags-input>
				</form-control>
				<form-Message class="col-span-3 col-start-2" />
			</form-item>
		</form-field>
	</div>
</template>
