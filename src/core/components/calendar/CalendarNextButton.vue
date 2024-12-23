<script lang="ts" setup>
	import { cn } from '@/core/utils'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
	import {
		CalendarNext,
		type CalendarNextProps,
		useForwardProps,
	} from 'radix-vue'
	import { computed, type HTMLAttributes } from 'vue'
	import { buttonVariants } from '../button'

	const props = defineProps<
		CalendarNextProps & { class?: HTMLAttributes['class'] }
	>()

	const delegatedProps = computed(() => {
		const { class: _, ...delegated } = props

		return delegated
	})

	const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
	<CalendarNext
		:class="
			cn(
				buttonVariants({ variant: 'outline' }),
				'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
				props.class,
			)
		"
		v-bind="forwardedProps"
	>
		<slot>
			<font-awesome-icon :icon="['fas', 'chevron-right']" />
		</slot>
	</CalendarNext>
</template>
