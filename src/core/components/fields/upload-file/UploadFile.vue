<script setup lang="ts">
	import { ref, type HTMLAttributes } from 'vue'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

	import { cn } from '@/core/utils'
	import { Avatar, AvatarFallback, AvatarImage } from '@/core/components/avatar'
	import { ButtonRoot } from '@/core/components/button'

	const props = defineProps<{
		defaultValue?: string
		modelValue?: string
		class?: HTMLAttributes['class']
		disabled?: boolean
		accept?: string
	}>()

	const emits = defineEmits<{
		(event: 'update:modelValue', payload: File | undefined): void
	}>()
	const previewFile = ref<string>('')
	const fileType = ref<string>('file')

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement
		const files = target.files

		if (!files) {
			previewFile.value = props.defaultValue ?? ''
			return
		}

		const imageUrl = URL.createObjectURL(files[0])
		previewFile.value = imageUrl
		fileType.value = files[0].type.split('/')[1]?.toUpperCase()
		emits('update:modelValue', files[0])
	}

	function handleFileClear() {
		previewFile.value = ''
		fileType.value = ''
		emits('update:modelValue', undefined)
	}
</script>

<template>
	<div :class="cn('flex w-full gap-4', props.class)">
		<button-root
			variant="ghost"
			class="text-primary font-bold"
			as-child
		>
			<label for="input-file">
				<font-awesome-icon class="w-5 h-5 mr-2" :icon="['fas', 'upload']" />
				Anexar Documento
			</label>
		</button-root>

		<input
			id="input-file"
			type="file"
			class="hidden"
			:disabled="disabled"
			:accept="props.accept"
			@change="handleFileChange"
		/>

		<div
			v-if="previewFile || defaultValue"
			class="flex gap-2 justify-center items-center"
		>
			<Avatar shape="square" size="sm">
				<AvatarImage
					:src="previewFile ? previewFile : defaultValue ?? ''"
					alt="preview"
				/>
				<AvatarFallback class="flex justify-center items-center">
					<font-awesome-icon class="w-4 h-4" :icon="['far', 'file-lines']" />
				</AvatarFallback>
			</Avatar>

			<button-root
				variant="ghost"
				size="icon"
				class="text-primary font-bold rounded-full"
				@click="handleFileClear"
			>
				<font-awesome-icon class="w-4 h-4 ml-1" :icon="['fas', 'x']" />
			</button-root>
		</div>
	</div>
</template>
