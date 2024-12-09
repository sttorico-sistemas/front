<script lang="ts" setup>
	import { InputRoot } from '@/core/components/fields/input'
	import {
		FormControl,
		FormField,
		FormItem,
		FormLabel,
		FormMessage,
	} from '@/core/components/form'
	import { type PropType } from 'vue'

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
	</div>
</template>
