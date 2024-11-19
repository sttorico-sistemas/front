<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { SelectScrollDownButton, type SelectScrollDownButtonProps, useForwardProps } from 'radix-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { cn } from '@/core/utils';

const props = defineProps<SelectScrollDownButtonProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
	<select-scroll-down-button v-bind="forwardedProps"
		:class="cn('flex cursor-default items-center justify-center py-1', props.class)">
		<slot>
			<font-awesome-icon :icon="['fas', 'chevron-down']" />
		</slot>
	</select-scroll-down-button>
</template>
