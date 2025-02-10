<script lang="ts" setup>
import type { LabelProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'

import { LabelRoot } from '@/core/components/label'
import { cn } from '@/core/utils';

import { useFormField } from './useFormField'

const properties = defineProps<
  LabelProps & { class?: HTMLAttributes['class'] }
>()

const { error, formItemId } = useFormField()
</script>

<template>
  <label-root
    :class="cn(error && 'text-destructive', properties.class, 'font-semibold')"
    :for="formItemId"
  >
    <slot />
  </label-root>
</template>
