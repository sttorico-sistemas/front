<script lang="ts" setup>
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

	import {
		AlertDialog,
		AlertDialogAction,
		AlertDialogCancel,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogHeader,
		AlertDialogTitle,
		AlertDialogTrigger,
	} from '@/core/components/alert-dialog'
	import {
		Tooltip,
		TooltipContent,
		TooltipProvider,
		TooltipTrigger,
	} from '@/core/components/tooltip'
	import { ButtonRoot } from '@/core/components/button'

	const properties = defineProps({
		dataId: { type: Number, required: true },
		tableServiceName: { type: String, required: true },
		isLoading: { type: Boolean, default: () => false },
		isActive: { type: Boolean, required: true },
	})
	const emits = defineEmits(['on-delete'])

	function handleDelete() {
		emits('on-delete', properties.dataId)
	}
</script>

<template>
	<alert-dialog>
		<alert-dialog-trigger>
			<tooltip-provider>
				<tooltip>
					<tooltip-trigger as-child>
						<button-root variant="ghost" size="icon">
							<font-awesome-icon
								:class="['w-5 h-5 text-danger']"
								:icon="['far', 'trash-can']"
							/>
						</button-root>
					</tooltip-trigger>
					<tooltip-content side="right">
						<p>Apagar página</p>
					</tooltip-content>
				</tooltip>
			</tooltip-provider>
		</alert-dialog-trigger>

		<alert-dialog-content>
			<alert-dialog-header>
				<alert-dialog-title
					>Deseja apagar "{{ tableServiceName }}"?</alert-dialog-title
				>
				<alert-dialog-description>
					A ação não poderá ser desfeita.
				</alert-dialog-description>
			</alert-dialog-header>
			<alert-dialog-footer>
				<alert-dialog-cancel>Cancelar</alert-dialog-cancel>
				<alert-dialog-action class="bg-danger text-white" @click="handleDelete"
					>Apagar</alert-dialog-action
				>
			</alert-dialog-footer>
		</alert-dialog-content>
	</alert-dialog>
</template>
