<script setup lang="ts">
import { cn } from '@/core/utils'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { TagsInputItemDelete, type TagsInputItemDeleteProps, useForwardProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<TagsInputItemDeleteProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <tags-input-item-delete v-bind="forwardedProps" :class="cn('flex rounded bg-transparent mr-1', props.class)">
    <slot>
      <font-awesome-icon class="text-white" :icon="['fas', 'xmark']" />
    </slot>
  </tags-input-item-delete>
</template>