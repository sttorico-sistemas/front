<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';
import uniqid from 'uniqid';
import type { FunctionalComponent } from 'vue';

const props = withDefaults(defineProps<{
	active?: boolean;
	appendIcon?: string | (string | [string, number])[] | (new () => any) | FunctionalComponent;
	autofocus?: boolean;
	baseColor?: string;
	bgColor?: string;
	centerAffix?: boolean;
	clearable?: boolean;
	clearIcon?: string | (string | [string, number])[] | (new () => any) | FunctionalComponent;
	color?: string;
	density?: 'default' | 'comfortable' | 'compact';
	direction?: 'horizontal' | 'vertical';
	disabled?: boolean;
	error?: boolean;
	message?: string;
	hint?: string;
	id?: string;
	items?: string[];
	label?: string;
	placeholder?: string;
	loading?: boolean;
	maxWidth?: string | number;
	minWidth?: string | number;
	maxHeight?: string | number;
	minHeight?: string | number;
	width?: string | number;
	height?: string | number;
	modelValue?: string;
	prefix?: string;
	suffix?: string;
}>(), {
	active: false,
	autofocus: false,
	baseColor: '',
	bgColor: '',
	centerAffix: false,
	clearable: false,
	disabled: false,
	error: false,
	density: 'default',
	direction: 'vertical',
	items: () => [],
	placeholder: '',
	loading: false,
});

const emit = defineEmits(['update:modelValue', 'clear']);

const inputId = computed(() => props.id ?? uniqid('select-'));

const computedClasses = computed(() => ({
	'cursor-not-allowed': props.disabled,
	'bg-red-100': props.error,
	'bg-white': !props.error && !props.disabled,
	'text-xs': props.density === 'compact',
	'text-sm': props.density === 'comfortable',
	'text-base': props.density === 'default',
	'flex-col': props.direction === 'vertical',
	'flex-row': props.direction === 'horizontal',
}));

const computedStyles = computed(() => ({
	backgroundColor: props.bgColor,
	color: props.color,
	width: props.width ? `${props.width}` : 'auto',
	height: props.height ? `${props.height}` : 'auto',
	maxWidth: props.maxWidth ? `${props.maxWidth}` : undefined,
	minWidth: props.minWidth ? `${props.minWidth}` : undefined,
	maxHeight: props.maxHeight ? `${props.maxHeight}` : undefined,
	minHeight: props.minHeight ? `${props.minHeight}` : undefined,
}));
const updateValue = (event: any) => {
	emit('update:modelValue', event.target.value);
};

const classDisabled = computed(() => {
	return props.disabled ? 'disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] cursor-not-allowed' : ''
})
</script>

<template>
	<div :class="['relative flex', computedClasses]" :style="computedStyles">
		<label v-if="label" :for="inputId" class="block text-xs">{{ label }}</label>

		<div class="relative flex items-center w-full">
			<span v-if="prefix" class="prefix-icon">{{ prefix }}</span>

			<select :id="inputId" :value="modelValue" :disabled="disabled" :placeholder="placeholder"
				:class="['form-select block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5', classDisabled]"
				:style="computedStyles" @change="updateValue">
				<option value="" disabled>{{ placeholder }}</option>
				<option v-for="(item, index) in items" :key="index" :value="item" style="color: black;">{{
					item }}
				</option>
			</select>

			<span v-if="clearable && modelValue" @click="emit('clear')" class="clear-icon cursor-pointer">
				<slot name="clear-icon">
					<svg v-if="!clearIcon" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
						stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
					<component v-if="clearIcon" :is="clearIcon" />
				</slot>
			</span>

			<span v-if="suffix" class="suffix-icon">{{ suffix }}</span>

			<span v-if="loading" class="loading-spinner">
				<slot name="loading-spinner">
					<svg xmlns="http://www.w3.org/2000/svg" class="animate-spin h-5 w-5 text-gray-500" fill="none"
						viewBox="0 0 24 24" stroke="currentColor">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
					</svg>
				</slot>
			</span>
		</div>

		<p v-if="error && message" class="mt-2 text-sm text-red-600">{{ message }}</p>

		<p v-if="hint && !error" class="mt-2 text-sm text-gray-500">{{ hint }}</p>
	</div>
</template>
