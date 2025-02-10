<script setup lang="ts">
withDefaults(defineProps < {
	label: string;
	labelLeft?: string;
	value?: string;
} > (), {
	label: '',
	labelLeft: '',
	value: '',
});
</script>

<template>
	<div>
		<label class="text-sm mb-0">{{ label }}</label>
		<div class="ltr:-mr-px rtl:-ml-px flex">
			<div
				class="border border-[#e0e6ed] dark:border-[#17263c] rounded-l bg-[#EAEAEC] flex items-center justify-center text-black px-4 py-1.5">
				{{ labelLeft }}</div>
			<input :value="value" class="w-48 flex-1 flex items-center border rounded-r px-2" />
		</div>
	</div>
</template>