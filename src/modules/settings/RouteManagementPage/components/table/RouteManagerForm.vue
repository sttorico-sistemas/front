<script lang="ts" setup>
	import { computed, type PropType } from 'vue'
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
		Tooltip,
		TooltipContent,
		TooltipProvider,
		TooltipTrigger,
	} from '@/core/components/tooltip'
	import {
		FormControl,
		FormField,
		FormItem,
		FormLabel,
		FormMessage,
	} from '@/core/components/form'
	import { InputRoot } from '@/core/components/fields/input'
	import { ButtonRoot } from '@/core/components/button'
	import { generalRepository, iamRepository } from '@/core/stores'
	import { SingleCheckboxTree } from '@/core/components/fields/checkbox-tree'
	import { Separator } from '@/core/components/separator'

	const emits =  defineEmits(['on-close'])
	defineProps({
		disabled: { type: Boolean, default: () => false },
		metadata: {
			type: Object as PropType<Record<string, any>>,
			default: () => ({}),
		},
	})

	const { data: allPages, isLoading: isAllPagesLoading } = useQuery({
		queryKey: generalRepository.getQueryKey('all-pages'),
		queryFn: ({ signal }) => generalRepository.getAllPages({ signal }),
	})

	const { data: treePermissions, isLoading: isTreePermissionsLoading } =
		useQuery({
			queryKey: iamRepository.getQueryKey('tree-permissions'),
			queryFn: ({ signal }) => iamRepository.getTreePermissions({ signal }),
		})

	const formattedAllTreePermissions = computed(() => {
		return (treePermissions.value ?? []).map((data) => data.toList())
	})

	const formattedAllPages = computed(() => {
		return (allPages.value ?? []).map(({ id, name }) => ({ id: `${id}`, name }))
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
							class="col-span-5"
							v-bind="componentField"
						/>
					</form-control>

					<form-message class="col-span-5 col-start-3" />
				</form-item>
			</form-field>

			<form-field v-slot="{ componentField }" name="slug">
				<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
					<form-label class="text-left col-span-2">Slug</form-label>
					<form-control>
						<input-root
							:disabled="disabled"
							type="text"
							placeholder="Digite o slug..."
							class="col-span-5"
							v-bind="componentField"
						/>
					</form-control>

					<form-message class="col-span-5 col-start-3" />
				</form-item>
			</form-field>

			<form-field v-slot="{ componentField }" name="url">
				<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
					<form-label class="text-left col-span-2">URL</form-label>
					<form-control>
						<input-root
							:disabled="disabled"
							type="text"
							placeholder="Digite a URL..."
							class="col-span-5"
							v-bind="componentField"
						/>
					</form-control>

					<form-message class="col-span-5 col-start-3" />
				</form-item>
			</form-field>
		</div>

		<div class="border border-primary rounded-md p-5 mt-5">
			<form-field v-slot="{ componentField, handleChange }" name="permissions">
				<form-label
					class="text-left mt-4 col-span-3 text-base text-primary font-bold"
				>
					Permissões
				</form-label>

				<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
					<single-checkbox-tree
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
