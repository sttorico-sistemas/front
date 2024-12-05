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
		FormControl,
		FormField,
		FormItem,
		FormLabel,
		FormMessage,
	} from '@/core/components/form'
	import { InputRoot } from '@/core/components/fields/input'
	import { generalRepository } from '@/core/stores'

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

	const formattedAllPages = computed(() => {
		return (allPages.value ?? []).map(({ id, name }) => ({ id: `${id}`, name }))
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

		<form-field v-slot="{ componentField }" name="parentId">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">Página pai</form-label>
				<form-control>
					<select-root :disabled="disabled" v-bind="componentField">
						<select-trigger class="col-span-5">
							<select-value placeholder="Selecione uma página pai..." />
						</select-trigger>
						<select-content>
							<select-group>
								<select-label>Páginas:</select-label>
								<select-item
									v-for="page of formattedAllPages"
									:key="page.id"
									:value="page.id.toString()"
									>{{ page.name }}</select-item
								>
							</select-group>
						</select-content>
					</select-root>
				</form-control>
				<form-message class="col-span-5 col-start-3" />
			</form-item>
		</form-field>
	</div>
</template>
