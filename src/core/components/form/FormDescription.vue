<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

import { cn } from '@/core/utils';
import { useFormField } from '@/core/components/form/useFormField';

const props = defineProps<{
	class?: HTMLAttributes['class']
}>()

const { formDescriptionId } = useFormField()
</script>

<template>
	<p :id="formDescriptionId" :class="cn('text-sm text-muted-foreground', props.class)">
		<slot />
	</p>
</template>
