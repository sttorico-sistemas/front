<script setup lang="ts">
import type { HTMLAttributes, PropType } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { ButtonRoot } from '@/core/components/button'
import {
	DialogRoot,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/core/components/dialog'
import { cn } from '@/core/utils';

const properties = defineProps({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	buttonName: {
		type: String,
		default: () => 'Salvar',
	},
	isLoading: {
		type: Boolean,
		default: false,
	},
	isAction: {
		type: Boolean,
		default: true,
	},
	class: {
		type: String as PropType<HTMLAttributes['class']>,
		default: '',
	},
})
const open = defineModel({ type: Boolean, default: false })
const emits = defineEmits(['form-submit'])

function onSubmit(event: Event) {
	emits('form-submit', event)
}
</script>

<template>
	<dialog-root v-model:open="open">
		<dialog-trigger v-if="$slots.trigger" as-child>
			<slot name="trigger"></slot>
		</dialog-trigger>
		<dialog-content :class="cn(
			'max-h-[90dvh] grid-rows-[auto_minmax(0,1fr)_auto] sm:max-w-[625px]',
			properties.class,
		)
			" @pointer-down-outside="(event: Event) => event.preventDefault()">
			<div v-if="isLoading" class="absolute z-[100] flex h-full w-full items-center justify-center bg-black/40">
				<Loader2 v-if="isLoading" class="ml-2 h-20 w-20 animate-spin text-3xl text-white/50" />
			</div>
			<dialog-header>
				<dialog-title>{{ title }}</dialog-title>
				<dialog-description>
					{{ description }}
				</dialog-description>
			</dialog-header>

			<form v-if="$slots.fields" class="grid gap-4 overflow-y-auto px-6 py-4" @submit="onSubmit">
				<slot name="fields"></slot>

				<dialog-footer>
					<slot name="buttons"></slot>

					<button-root v-if="isAction" :disabled="isLoading" type="submit" class="mt-4">
						{{ buttonName }}
						<font-awesome-icon :icon="['fas', 'spinner']" />
					</button-root>
				</dialog-footer>
			</form>
		</dialog-content>
	</dialog-root>
</template>
