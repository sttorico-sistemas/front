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
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/core/components/tooltip'
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
	tooltip: {
		type: String,
		default: () => ''
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


		<tooltip-provider>
			<tooltip>
				<tooltip-trigger as-child>
					<dialog-trigger v-if="$slots.trigger" as-child>
						<slot name="trigger"></slot>
					</dialog-trigger>
				</tooltip-trigger>
				<tooltip-content side="right">
					<p>{{ tooltip }}</p>
				</tooltip-content>
			</tooltip>
		</tooltip-provider>


		<dialog-content :class="cn(
			'max-h-[90dvh] grid-rows-[auto_minmax(0,1fr)_auto] sm:max-w-[625px]',
			properties.class,
		)
			" @pointer-down-outside="(event: Event) => event.preventDefault()">
			<div v-if="isLoading" class="absolute z-[100] flex h-full w-full items-center justify-center bg-black/40">
				<font-awesome-icon v-if="isLoading" :icon="['fas', 'spinner']" class="animate-spin" />
			</div>
			<dialog-header>
				<dialog-title>{{ title }}</dialog-title>
				<dialog-description>
					{{ description }}
				</dialog-description>
			</dialog-header>

			<form v-if="$slots.fields" class="grid overflow-y-auto py-4" @submit="onSubmit">
				<slot name="fields"></slot>

				<dialog-footer>
					<slot name="buttons"></slot>

					<button-root v-if="isAction" :disabled="isLoading" type="submit" class="mt-4 bg-primary text-white gap-2">
						{{ buttonName }}
						<font-awesome-icon v-if="isLoading" :icon="['fas', 'spinner']" class="animate-spin" />
					</button-root>
				</dialog-footer>
			</form>
		</dialog-content>
	</dialog-root>
</template>
