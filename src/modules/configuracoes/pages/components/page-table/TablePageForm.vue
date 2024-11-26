<script lang="ts" setup>
	import { Input } from '@/core/components/fields/input'
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
	import { generalRepository } from '@/core/stores/general.stores'
	import { useQuery } from '@tanstack/vue-query'
	import { computed, type PropType } from 'vue'

	defineProps({
		disabled: { type: Boolean, default: () => false },
		metadata: {
			type: Object as PropType<Record<string, string | number | undefined | null>>,
			default: () => ({}),
		},
	})

	const { data: allPages, isLoading: isAllPagesLoading } = useQuery({
		queryKey: generalRepository.getQueryKey('all-pages'),
		queryFn: ({ signal }) => generalRepository.getAllPages({ signal }),
	})

	const formattedAllPages = computed(() => {
		return (allPages.value ?? []).map(({ id, name }) => ({ id, name }))
	})
</script>

<template>
	<div class="flex flex-col gap-4">
		<FormField v-slot="{ componentField }" name="name">
			<FormItem class="grid grid-cols-4 items-center gap-x-4 gap-y-1">
				<FormLabel class="text-right">Nome da Página</FormLabel>
				<FormControl>
					<Input
						:disabled="disabled"
						type="text"
						placeholder="Digite o nome da página..."
						class="col-span-3"
						v-bind="componentField"
					/>
				</FormControl>

				<FormMessage class="col-span-3 col-start-2" />
			</FormItem>
		</FormField>

		<FormField v-slot="{ componentField }" name="slug">
			<FormItem class="grid grid-cols-4 items-center gap-x-4 gap-y-1">
				<FormLabel class="text-right">Slug</FormLabel>
				<FormControl>
					<Input
						:disabled="disabled"
						type="text"
						placeholder="Digite o slug..."
						class="col-span-3"
						v-bind="componentField"
					/>
				</FormControl>

				<FormMessage class="col-span-3 col-start-2" />
			</FormItem>
		</FormField>

		<FormField v-slot="{ componentField }" name="url">
			<FormItem class="grid grid-cols-4 items-center gap-x-4 gap-y-1">
				<FormLabel class="text-right">URL</FormLabel>
				<FormControl>
					<Input
						:disabled="disabled"
						type="text"
						placeholder="Digite a URL..."
						class="col-span-3"
						v-bind="componentField"
					/>
				</FormControl>

				<FormMessage class="col-span-3 col-start-2" />
			</FormItem>
		</FormField>

		<FormField v-slot="{ componentField }" name="parentId">
			<FormItem class="grid grid-cols-4 items-center gap-x-4 gap-y-1">
				<FormLabel class="text-right">Página pai</FormLabel>
				<FormControl>
					<SelectRoot :disabled="disabled" v-bind="componentField">
						<SelectTrigger class="col-span-3">
							<SelectValue placeholder="Selecione uma página pai..." />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Páginas:</SelectLabel>
								<SelectItem
									v-for="page of formattedAllPages"
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
		</FormField>
	</div>
</template>
