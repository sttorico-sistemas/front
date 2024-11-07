<script setup lang="ts">
import { computed, InputTypeHTMLAttribute } from 'vue';
import uniqid from 'uniqid';

type Breakpoints = {
	xs?: string;
	sm?: string;
	md?: string;
	lg?: string;
	xl?: string;
};

const props = withDefaults(
	defineProps<{
		id?: string;
		label?: string;
		class?: string;
		modelValue?: string;
		type?: InputTypeHTMLAttribute;
		placeholder?: string;
		message?: string;
		error?: boolean;
		disabled?: boolean;
		minWidth?: string | Breakpoints;
		maxWidth?: string | Breakpoints;
		minHeight?: string | Breakpoints;
		maxHeight?: string | Breakpoints;
		width?: string | Breakpoints;
		height?: string | Breakpoints;
		mask?:
			| 'cel'
			| 'tel'
			| 'cpf'
			| 'cnpj'
			| {
					custom: string;
			  };
	}>(),
	{
		label: '',
		modelValue: '',
		class: '',
		type: 'text',
		placeholder: '',
		message: '',
		error: false,
		disabled: false,
		mask: () => ({
			custom: '',
		}),
	},
);

defineEmits(['update:modelValue', 'submit']);

const randomId = computed(() => {
	return uniqid('input-');
});

const mask = computed(() => {
	switch (props.mask) {
		case 'cel':
			return '(##) # ####-####';
		case 'tel':
			return '(##) ####-####';
		case 'cpf':
			return '###.###.###-##';
		case 'cnpj':
			return '##.###.###/####-##';
		default:
			return props.mask.custom;
	}
});

function generateSizeClasses(
	prop: string | Breakpoints | undefined,
	prefix: string,
) {
	if (typeof prop === 'string') {
		return `${prefix}-[${prop}]`;
	} else if (prop && typeof prop === 'object') {
		return Object.entries(prop)
			.map(([bp, size]) => `${bp}:${prefix}-[${size}]`)
			.join(' ');
	}
	return '';
}

const sizeClasses = computed(() => ({
	minWidth: generateSizeClasses(props.minWidth, 'min-w'),
	maxWidth: generateSizeClasses(props.maxWidth, 'max-w'),
	minHeight: generateSizeClasses(props.minHeight, 'min-h'),
	maxHeight: generateSizeClasses(props.maxHeight, 'max-h'),
	width: generateSizeClasses(props.width, 'w'),
	height: generateSizeClasses(props.height, 'h'),
}));
</script>

<template>
	<div
		:class="[
			sizeClasses.minWidth,
			sizeClasses.maxWidth,
			sizeClasses.minHeight,
			sizeClasses.maxHeight,
			sizeClasses.width,
			sizeClasses.height,
			error ? 'has-error' : '',
		]"
		style="display: flex; flex: 1; flex-direction: column"
	>
		<label :for="id ?? randomId" class="text-xs" v-if="label">
			{{ label }}
		</label>
		<input
			:id="id ?? randomId"
			:type="type"
			:value="modelValue"
			:placeholder="placeholder"
			:class="[
				'form-input',
				props.class,
				sizeClasses.minWidth,
				sizeClasses.maxWidth,
				sizeClasses.minHeight,
				sizeClasses.maxHeight,
				sizeClasses.width,
				sizeClasses.height,
			]"
			:disabled="disabled"
			v-maska="mask"
			@input="
				$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)
			"
			@keydown.enter="$emit('submit')"
		/>
		<div v-if="message">
			<p class="text-danger mt-1">{{ message }}</p>
		</div>
	</div>
</template>
