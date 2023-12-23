<script lang="ts" setup>
	const props = defineProps({
		isOpen: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: '',
		},
		size: {
			type: String,
			default: 'max-w-lg',
		},
		btnSave: {
			type: Boolean,
			default: false,
		},
		btnClose: {
			type: Boolean,
			default: false,
		},
		btnSaveText: {
			type: String,
			default: 'Salvar',
		},
		btnCloseText: {
			type: String,
			default: 'Fechar',
		},
	})

	const emits = defineEmits(['btnSave', 'btnClose'])
</script>

<template>
	<div class="mb-5" x-data="modal">
		<div
			class="fixed inset-0 bg-[black]/60 z-[999] hidden overflow-y-auto"
			:class="isOpen && '!block'"
		>
			<div
				class="flex items-center justify-center min-h-screen px-4"
				@click.self="emits('btnClose', false)"
			>
				<div
					x-show="open"
					x-transition
					x-transition.duration.300
					class="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8"
					:class="props.size"
				>
					<div
						class="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3"
					>
						<h5 class="text-lg font-semibold text-primary_3-table">
							{{ props.title }}
						</h5>
						<button
							type="button"
							class="text-white-dark hover:text-dark"
							@click="emits('btnClose', false)"
						>
							X
						</button>
					</div>
					<div class="p-5">
						<div
							class="dark:text-white-dark/70 text-base font-medium text-[#1f2937]"
						>
							<slot></slot>
						</div>
						<div class="flex justify-end items-center mt-8">
							<button
								v-show="props.btnClose"
								type="button"
								class="btn btn-outline-danger"
								@click="emits('btnClose', false)"
							>
								{{ props.btnCloseText }}
							</button>
							<button
								v-show="props.btnSave"
								type="button"
								class="btn btn-primary ml-4 mr-4"
								@click="emits('btnSave', true)"
							>
								{{ props.btnSaveText }}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
