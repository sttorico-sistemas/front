<script lang="ts" setup>
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

	import {
		Tooltip,
		TooltipContent,
		TooltipProvider,
		TooltipTrigger,
	} from '@/core/components/tooltip'
	import { ButtonRoot } from '@/core/components/button'
	import { useRouter } from 'vue-router'

	const router = useRouter()
	const properties = defineProps({
		dataId: { type: Number, required: true },
		isLoading: { type: Boolean, default: () => false },
		isActive: { type: Boolean, required: true },
	})

	function handleGoToDetail() {
		router.push({
			name: 'cadastros-consignantes-detail',
			params: { id: properties.dataId },
		})
	}
</script>

<template>
	<tooltip-provider>
		<tooltip>
			<tooltip-trigger as-child>
				<button-root variant="ghost" size="icon" @click="handleGoToDetail">
					<font-awesome-icon
						:class="['w-5 h-5 text-primary']"
						:icon="['fas', 'eye']"
					/>
				</button-root>
			</tooltip-trigger>
			<tooltip-content side="right">
				<p>Detalhes consignante</p>
			</tooltip-content>
		</tooltip>
	</tooltip-provider>
</template>
