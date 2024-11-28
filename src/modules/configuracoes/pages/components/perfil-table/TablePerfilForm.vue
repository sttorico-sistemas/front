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

	const { data: permissions, isLoading: isPermissionsLoading } = useQuery({
		queryKey: iamRepository.getQueryKey('all-permissions'),
		queryFn: ({ signal }) => iamRepository.getPermissions({ signal }),
	})

	const formattedPermissions = computed(() => {
		return (permissions.value ?? []).map(({ id, relatedName }) => ({
			id,
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
						class="col-span-3 flex-col"
						:disabled="disabled"
						v-model="componentField.modelValue"
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
										v-for="page of formattedPermissions"
										:disabled="
											((value as any[]) ?? []).some(
												(value) => value.toString() === page.id.toString(),
											)
										"
										:key="page.id"
										:value="page.id.toString()"
										>{{ page.name }}</SelectItem
									>
								</SelectGroup>
							</SelectContent>
						</SelectRoot>

						<div
							class="flex flex-wrap w-full gap-2 items-start justify-start px-3 py-2 text-sm"
						>
							<TagsInputItem
								v-for="item in componentField.modelValue"
								:key="item"
								:value="formattedPermissionsMap[item]"
							>
								<TagsInputItemText />
								<TagsInputItemDelete />
							</TagsInputItem>
						</div>
					</TagsInput>
				</FormControl>
				<FormMessage class="col-span-3 col-start-2" />
			</FormItem>
		</FormField>
		<!--
		<FormField v-slot="{ componentField }" name="permissions">
			<FormItem class="grid grid-cols-4 items-center gap-x-4 gap-y-1">
				<FormLabel class="text-right">Permissões</FormLabel>
				<FormControl>
					<SelectRoot :disabled="disabled" v-bind="componentField">
						<SelectTrigger class="col-span-3">
							<SelectValue placeholder="Selecione uma permissão..." />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Permissões:</SelectLabel>
								<SelectItem
									v-for="page of formattedPermissions"
									:key="page.id"
									:value="page.id.toString()"
									>{{ page.name }}</SelectItem
								>
							</SelectGroup>
						</SelectContent>
					</SelectRoot>
				</FormControl>
				<FormMessage class="col-span-3 col-start-2" />
			</FormItem>
		</FormField> -->
	</div>
</template>
