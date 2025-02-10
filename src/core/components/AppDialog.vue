<script lang="ts" setup>
import { withDefaults } from 'vue';

const props = withDefaults(defineProps<{
  modelValue?: boolean;
  maxWidth?: string | number;
  maxHeight?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  width?: string | number;
  height?: string | number;
}>(), {
  modelValue: false,
  maxWidth: '500px',
  maxHeight: 'auto',
  minWidth: '300px',
  minHeight: 'auto',
  width: 'auto',
  height: 'auto',
});

const emits = defineEmits(['update:modelValue']);

const closeModal = () => {
  emits('update:modelValue', false);
};
</script>

<template>
  <div v-if="modelValue" class="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto flex items-center justify-center">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="panel border-0 p-0 rounded-lg overflow-hidden w-full my-8"
        :style="{ maxWidth: props.maxWidth, maxHeight: props.maxHeight, minWidth: props.minWidth, minHeight: props.minHeight, width: props.width, height: props.height }">

        <div class="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
          <h5 class="flex items-center gap-2 text-lg font-semibold text-primary">
            <slot name="title"></slot>
          </h5>
          <button type="button" class="text-white hover:text-dark ml-3" @click="closeModal">X</button>
        </div>

        <div class="px-5">
          <p class="text-sm text-gray-500">
            <slot name="subtitle"></slot>
          </p>
        </div>

        <div class="px-5 pt-2">
          <div class="dark:text-white/70 text-base font-medium text-[#1f2937]">
            <slot></slot>
          </div>
        </div>

        <div class="px-5 pb-5 flex justify-end items-center mt-5">
          <slot name="actions">
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
