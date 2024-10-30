<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import CircularProgress from './CircularProgress.vue';

const router = useRouter();
const emit = defineEmits(['click']);

const props = withDefaults(defineProps<{
  variant?: 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain';
  block?: boolean;
  color?: string;
  density?: 'default' | 'comfortable' | 'compact';
  disabled?: boolean;
  width?: string | number;
  height?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
  minHeight?: string | number;
  minWidth?: string | number;
  position?: 'static' | 'relative' | 'fixed' | 'absolute' | 'sticky';
  to?: string;
  rounded?: number | { top: number; bottom: number; left: number; right: number; } | { horizontal: number; vertical: number; };
  loading?: boolean;
  elevation?: number;
}>(), {
  variant: 'elevated',
  block: false,
  color: 'primary_3-table',
  density: 'default',
  disabled: false,
  loading: false,
  elevation: 0,
});

const variantClass = computed(() => {
  switch (props.variant) {
    case 'outlined':
      return 'border border-primary_3-table text-primary_3-table bg-transparent';
    case 'flat':
      return `bg-${props.color} text-white shadow-none`;
    case 'text':
      return `text-${props.color} bg-transparent shadow-none`;
    case 'elevated':
      return `bg-${props.color} text-white`;
    case 'tonal':
      return `bg-${props.color} text-white border`;
    case 'plain':
      return `bg-transparent text-${props.color}`;
    default:
      return '';
  }
});

const densityClass = computed(() => {
  switch (props.density) {
    case 'compact':
      return 'py-1 px-2 text-xs';
    case 'comfortable':
      return 'py-2 px-3 text-sm';
    case 'default':
      return 'py-3 px-4 text-base';
    default:
      return '';
  }
});

const positionClass = computed(() => {
  return props.position ? `position-${props.position}` : '';
});

const roundedClass = computed(() => {
  if (typeof props.rounded === 'number') {
    return `rounded-[${props.rounded}px]`;
  }
  if (typeof props.rounded === 'object') {
    const { top, bottom, left, right, horizontal, vertical } = props.rounded as any;
    return [
      top ? `rounded-t-[${top}px]` : '',
      bottom ? `rounded-b-[${bottom}px]` : '',
      left ? `rounded-l-[${left}px]` : '',
      right ? `rounded-r-[${right}px]` : '',
      horizontal ? `rounded-l-[${horizontal}px] rounded-r-[${horizontal}px]` : '',
      vertical ? `rounded-t-[${vertical}px] rounded-b-[${vertical}px]` : '',
    ].filter(Boolean).join(' ');
  }
  return 'rounded-lg';
});

const colorClass = computed(() => {
  return `text-${props.color}`;
});

const shadowClass = computed(() => {
  if (props.variant === 'elevated' && props.elevation) {
    return `shadow-lg shadow-opacity-${props.elevation}`;
  }
  if (props.variant === 'outlined' || props.elevation === 0) {
    return 'shadow-none';
  }
  return '';
});

const handleClick = (e: MouseEvent) => {
  e.preventDefault();
  if (props.to) {
    router.push(props.to);
  } else {
    emit('click');
  }
};
</script>

<template>
  <button :class="[
    'btn',
    block ? 'w-full' : width ? `w-[${width}]` : 'w-auto',
    height ? `h-[${height}px]` : '',
    maxWidth ? `max-w-[${maxWidth}px]` : '',
    maxHeight ? `max-h-[${maxHeight}px]` : '',
    minWidth ? `min-w-[${minWidth}px]` : '',
    minHeight ? `min-h-[${minHeight}px]` : '',
    position ? positionClass : '',
    roundedClass,
    variantClass,
    densityClass,
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    colorClass,
    shadowClass,
  ]" :disabled="disabled || loading" @click="(e) => handleClick(e)">
    <template v-if="loading">
      <circular-progress :size="20" />
    </template>
    <template v-else>
      <slot />
    </template>
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s;
}
</style>
