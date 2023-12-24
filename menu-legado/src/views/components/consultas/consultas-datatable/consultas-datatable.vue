<script lang="ts" setup>
	import { ref } from 'vue'
	import Vue3Datatable from '@bhplugin/vue3-datatable'

	import modalLayout from '@components/layout/modalLayout.vue'

	const props = defineProps({
		cols: {
			type: Object,
			required: true,
		},
		rows: {
			type: Array,
			required: true,
		},
		selected: {
			type: Object,
			default: () => {},
		},
	})

	const isOpenDialog = ref<boolean>(false)

	const color = (id: number | string): string => {
		switch (id) {
			case 1:
				return 'bg-info' // Reservada
			case 2:
				return 'bg-danger' // Suspensa
			case 3:
				return 'bg-secondary' // Baixada
			case 4:
				return 'bg-warning' // Cancelada
			default:
				return '#E0E6ED'
		}
	}

	const filtered = (value: string = '') => {
		if (value === '') return props.rows

		if (props.selected.type === 'tipo_de_consignacao')
			return props.rows.filter((item: any) => item.tipo_consignado === value)

		if (props.selected.type === 'consignataria')
			return props.rows.filter((item: any) => item.consignataria === value)

		if (props.selected.type === 'situacao')
			return props.rows.filter((item: any) => item.status.label === value)
	}

	// fonte: https://vue3-datatable-document.vercel.app/skeleton-loader
</script>

<template>
	<div class="datatable mb-[344px]">
		<vue3-datatable
			:rows="filtered(props.selected.label)"
			:columns="cols"
			:total-rows="filtered(props.selected.label)?.length"
			:sortable="true"
			skin="whitespace-nowrap bh-table-striped"
			no-data-content="Nenhum dado foi encontrado"
			pagination-info="Mostrando {0} a {1} de {2} entradas"
		>
			<template #rmc="data">
				<button @click="isOpenDialog = true">
					<strong class="text-primary_3-table">{{ data.value.rmc }}</strong>
				</button>
			</template>
			<template #status="data">
				<span
					class="flex justify-center badge !w-[80px] h-[22px]"
					:class="color(data.value.status.id)"
					>{{ data.value.status.label }}</span
				>
			</template>
		</vue3-datatable>
	</div>

	<!-- Modal -->
	<modal-layout
		:is-open="isOpenDialog"
		title="Resumo dos Contratos"
		size="max-w-full"
		btn-close
		@btn-close="isOpenDialog = false"
	>
		<!-- Datatable-->
		<div class="datatable">
			<vue3-datatable
				:rows="rows"
				:columns="cols"
				:total-rows="rows.length"
				:sortable="true"
				skin="whitespace-nowrap bh-table-striped"
				first-arrow=""
				no-data-content="Nenhum dado foi encontrado"
				pagination-info="Mostrando {0} a {1} de {2} entradas"
			>
				<template #rmc="data">
					<button @click="isOpenDialog = true">
						<strong class="text-primary_3-table">{{ data.value.rmc }}</strong>
					</button>
				</template>
				<template #status="data">
					<span
						class="flex justify-center badge !w-[80px] h-[22px]"
						:class="color(data.value.status.id)"
						>{{ data.value.status.label }}</span
					>
				</template>
			</vue3-datatable>
		</div>
		<!-- Datatable-->
	</modal-layout>
	<!-- Modal -->
</template>

<style lang="scss">
	.datatable .bh-table-responsive table thead tr th {
		color: #1384ad;
		font-size: 14px;
		font-style: normal;
		font-weight: 600;
		line-height: normal;
	}
</style>
