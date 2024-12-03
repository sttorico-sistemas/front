<script setup lang="ts">
	import { TreeRoot, TreeItem } from 'radix-vue'
	import { Checkbox } from '@/core/components/fields/checkbox'
	import { useVModel } from '@vueuse/core'

	type TreeData = {
		id: string
		title: string
		children?: TreeData[]
	}

	const props = withDefaults(
		defineProps<{
			data: Array<TreeData>
			modelValue?: Omit<TreeData, 'children'>[]
			defaultValue?: Omit<TreeData, 'children'>[]
		}>(),
		{
			data: () => [],
		},
	)

	const emits = defineEmits<{
		(event: 'update:modelValue', payload: string | number): void
	}>()

	const modelValue = useVModel(props, 'modelValue', emits, {
		passive: true,
		defaultValue: props.defaultValue,
	})
</script>

<template>
	<tree-root
		v-slot="{ flattenItems }"
		v-model="modelValue"
		class="list-none w-full select-none bg-white text-blackA11 rounded-lg p-2 text-sm font-medium"
		:items="data"
		:get-key="(item) => item.id"
		multiple
		propagate-select
	>
		<tree-item
			v-for="item in flattenItems"
			v-slot="{ isExpanded, handleSelect, isSelected }"
			:key="item._id"
			:style="{ 'padding-left': `${item.level - 0.5}rem` }"
			v-bind="item.bind"
			class="flex items-center py-1 px-2 my-0.5 rounded outline-none focus:ring-grass8 focus:ring-2 data-[selected]:bg-grass4"
			@select="
				(event) => {
					if (event.detail.originalEvent.type === 'click') {
						event.preventDefault()
					}
				}
			"
			@toggle="
				(event) => {
					if (event.detail.originalEvent.type === 'keydown') {
						event.preventDefault()
					}
				}
			"
		>
			<template v-if="item.hasChildren">
				<font-awesome-icon v-if="!isExpanded" :icon="['fas', 'chevron-up']" />
				<font-awesome-icon v-else :icon="['fas', 'chevron-down']" />
			</template>

			<font-awesome-icon
				v-if="item.hasChildren"
				class="mx-2 text-slate-400"
				:icon="['fas', 'folder']"
			/>

			<font-awesome-icon
				v-else
				class="mx-2 text-primary_3-table"
				:icon="['fas', 'lock']"
			/>

			<div
				:class="[
					'flex flex-1 gap-4',
					!item.hasChildren ? 'border-b border-slate-200 py-2' : '',
				]"
			>
				<div class="pl-2 flex-1">
					{{ item.value.title }}
				</div>

				<div v-if="!item.hasChildren">
					<Checkbox :checked="isSelected" @update:checked="handleSelect" />
				</div>
			</div>
		</tree-item>
	</tree-root>
</template>
