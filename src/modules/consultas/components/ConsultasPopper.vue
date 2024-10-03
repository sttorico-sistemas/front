<script lang="ts" setup>
import IconCaretDown from '@/core/components/Icons/IconCaretDown.vue'
import { PropType } from 'vue'

defineProps({
	label: {
		type: String,
		default: '',
	},
	options: {
		type: Object as PropType<any>,
		required: true,
	},
})
</script>
<template>
	<div class="dropdown">
		<Popper placement="bottom-end" offset-distance="0" class="align-middle">
			<button type="button"
				class="flex items-center border font-semibold border-[#e0e6ed] rounded-md px-4 py-2 text-sm">
				<span class="text-xs text-black mr-5">{{ label }}</span>
				<icon-caret-down class="w-5 h-5" />
			</button>
			<template #content>
				<ul class="whitespace-nowrap">
					<template v-for="(option, i) in options" :key="i">
						<li>
							<div class="flex items-center px-4 py-1">
								<label class="cursor-pointer mb-0">
									<input :id="`chk-${i}`" type="checkbox" class="form-checkbox" :value="option.field"
										:checked="!option.hide" @change="
											option.hide = !($event.target as HTMLInputElement).checked
											" />
									<span :for="`chk-${i}`" class="ml-2 mr-2 text-xs text-black">{{ option.title }}</span>
								</label>
							</div>
						</li>
					</template>
				</ul>
			</template>
		</Popper>
	</div>
</template>
