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
		tableInstructionOfProcedureName: { type: String, required: true },
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
						<button-root variant="outline" disabled>
							<font-awesome-icon
								:class="['w-5 h-5', isActive ? 'text-warning' : 'text-success']"
								:icon="isActive ? ['fas', 'ban'] : ['far', 'circle-check']"
							/>
						</button-root>
					</tooltip-trigger>
					<tooltip-content side="right">
						<p>{{ isActive ? 'Desativar' : 'Ativar' }} averbador</p>
					</tooltip-content>
				</tooltip>
			</tooltip-provider>
		</alert-dialog-trigger>

		<alert-dialog-content>
			<alert-dialog-header>
				<alert-dialog-title
					>Deseja {{ isActive ? 'desativar' : 'ativar' }} "{{
						tableInstructionOfProcedureName
					}}"?</alert-dialog-title
				>
				<alert-dialog-description>
					A ação poderá ser desfeita a qualquer momento.
				</alert-dialog-description>
			</alert-dialog-header>
			<alert-dialog-footer>
				<alert-dialog-cancel>Cancelar</alert-dialog-cancel>
				<alert-dialog-action
					:class="['text-white', isActive ? 'bg-warning' : 'bg-success']"
					@click="handleDelete"
					>{{ isActive ? 'Desativar' : 'Ativar' }}</alert-dialog-action
				>
			</alert-dialog-footer>
		</alert-dialog-content>
	</alert-dialog>
</template>
