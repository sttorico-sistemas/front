<script lang="ts" setup>
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
	import {
		TagsInput,
		TagsInputInput,
		TagsInputItem,
		TagsInputItemDelete,
		TagsInputItemText,
	} from '@/core/components/tags-input'
	import { iamRepository } from '@/core/stores'
	import { useQuery } from '@tanstack/vue-query'
	import { computed, ref, type PropType } from 'vue'

	const selectValue = ref('')

	defineProps({
		disabled: { type: Boolean, default: () => false },
		metadata: {
			type: Object as PropType<Record<string, any>>,
			default: () => ({}),
		},
	})

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
	<div class="flex flex-col gap-4">
		<FormField v-slot="{ componentField }" name="name">
			<FormItem class="grid grid-cols-4 items-center gap-x-4 gap-y-1">
				<FormLabel class="text-right">Nome</FormLabel>
				<FormControl>
					<input-root
						:disabled="disabled"
						type="text"
						placeholder="Digite o nome..."
						class="col-span-3"
						v-bind="componentField"
					/>
				</FormControl>

				<FormMessage class="col-span-3 col-start-2" />
			</FormItem>
		</FormField>

		<FormField v-slot="{ componentField }" name="description">
			<FormItem class="grid grid-cols-4 items-center gap-x-4 gap-y-1">
				<FormLabel class="text-right">Descrição</FormLabel>
				<FormControl>
					<input-root
						:disabled="disabled"
						type="text"
						placeholder="Digite a descrição..."
						class="col-span-3"
						v-bind="componentField"
					/>
				</FormControl>

				<FormMessage class="col-span-3 col-start-2" />
			</FormItem>
		</FormField>

		<FormField
			v-slot="{ componentField, handleInput, value }"
			name="permissions"
		>
			<FormItem class="grid grid-cols-4 items-center gap-x-4 gap-y-1">
				<FormLabel class="text-right">Permissões</FormLabel>
				<FormControl>
					<TagsInput
						v-model="componentField.modelValue"
						class="col-span-3 flex-col"
						:disabled="disabled"
						:displayValue="
							(value) => {
								return formattedPermissionsMap[value as string]
							}
						"
					>
						<SelectRoot
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
							<SelectTrigger class="col-span-3">
								<SelectValue placeholder="Selecione uma permissão..." />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Permissões:</SelectLabel>
									<SelectItem
										v-for="permission of formattedPermissions"
										:disabled="
											((value as any[]) ?? []).some(
												(value) => value === permission.id,
											)
										"
										:key="permission.id"
										:value="permission.id"
										>{{ permission.name }}</SelectItem
									>
								</SelectGroup>
							</SelectContent>
						</SelectRoot>

						<div
							class="flex flex-wrap w-full gap-2 items-start justify-start px-3 py-2 text-sm"
						>
							<TagsInputItem v-for="item in value" :key="item" :value="item">
								<TagsInputItemText />
								<TagsInputItemDelete />
							</TagsInputItem>
						</div>
					</TagsInput>
				</FormControl>
				<FormMessage class="col-span-3 col-start-2" />
			</FormItem>
		</FormField>
	</div>
</template>
