<script lang="ts" setup>
import { Input } from '@/core/components/fields/input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/core/components/form';
import { type PropType } from 'vue';

defineProps({
	disabled: { type: Boolean, default: () => false },
	metadata: {
		type: Object as PropType<Record<string, string>>,
		default: () => ({}),
	},
});
</script>

<template>
	<div class="flex flex-col gap-4">
		<FormField v-slot="{ componentField }" name="name">
			<FormItem class="grid grid-cols-4 items-center gap-x-4 gap-y-1">
				<FormLabel class="text-right">Nome</FormLabel>
				<FormControl>
					<Input :disabled="disabled" type="text" placeholder="Digite o nome..." class="col-span-3"
						v-bind="componentField" />
				</FormControl>

				<FormMessage class="col-span-3 col-start-2" />
			</FormItem>
		</FormField>
	</div>
</template>