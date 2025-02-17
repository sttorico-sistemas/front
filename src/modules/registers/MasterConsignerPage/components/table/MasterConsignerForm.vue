<script lang="ts" setup>
	import { type PropType } from 'vue'

	import { InputRoot } from '@/core/components/fields/input'
	import {
		FormControl,
		FormField,
		FormItem,
		FormLabel,
		FormMessage,
	} from '@/core/components/form'
	import { ButtonRoot } from '@/core/components/button'

	const emits =  defineEmits(['on-close'])
	defineProps({
		disabled: { type: Boolean, default: () => false },
		metadata: {
			type: Object as PropType<Record<string, any>>,
			default: () => ({}),
		},
	})

	function onClose() {
		emits('on-close')
	}
</script>

<template>
	<div class="flex flex-col mx-2">
		<form-field v-slot="{ componentField }" name="name">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-12">Nome</form-label>
				<form-control>
					<input-root
						:disabled="disabled"
						type="text"
						placeholder="Digite o nome..."
						class="col-span-12"
						v-bind="componentField"
					/>
				</form-control>

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
</template>
