<script lang="ts" setup>
	import { reactive, ref } from 'vue'

	// Componentes
	import breadcrumbs from '@components/layout/breadcrumbsLayout.vue'
	import Vue3Datatable from '@bhplugin/vue3-datatable'

	import ConsultasExport from './consultas-export/consultas-export.vue'
	import ConsultasTitulo from './consultas-titulo/consultas-titulo.vue'

	// Icons
	import IconClear from '@icons/iconClear.vue'
	import IconPrinter from '@icons/iconPrinter.vue'

	// Declarações
	const selected = reactive<{ type: string; label: string }>({
		type: '',
		label: '',
	})
	const margem = ref<string>('')
	const margemTitlePercent = ref<string>('')
	const cols = reactive([
		{ field: 'data', title: 'Data', hide: false },
		{ field: 'protocolo', title: 'Protocolo', hide: false },
		{ field: 'origem', title: 'Origem', hide: false },
		{ field: 'motivo', title: 'Motivo', hide: false },
		{
			field: 'valor_informado',
			title: 'Valor Informado',
			hide: false,
		},
	])
	const rows = reactive([
		{
			titulo: 'Margem Principal - 35%',
			margem35: [
				{
					data: '10/03/2023',
					protocolo: '12345845',
					origem: 'Folha Mês Março/23',
					motivo: 'Atualização Mensal',
					valor_informado: 'R$ 1.000,00',
				},
				{
					data: '10/03/2023',
					protocolo: '12345845',
					origem: 'Folha Mês Março/23',
					motivo: 'Atualização Mensal',
					valor_informado: 'R$ 1.000,00',
				},
			],
		},
		{
			titulo: 'Margem Principal - 5%',
			margem5: [
				{
					data: '10/03/2023',
					protocolo: '12345845',
					origem: 'Folha Mês Março/23',
					motivo: 'Atualização Mensal',
					valor_informado: 'R$ 2.000,00',
				},
				{
					data: '10/03/2023',
					protocolo: '12345845',
					origem: 'Folha Mês Março/23',
					motivo: 'Atualização Mensal',
					valor_informado: 'R$ 2.000,00',
				},
			],
		},
		{
			titulo: 'Margem Principal - 10%',
			margem10: [
				{
					data: '10/03/2023',
					protocolo: '12345845',
					origem: 'Folha Mês Março/23',
					motivo: 'Atualização Mensal',
					valor_informado: 'R$ 3.000,00',
				},
				{
					data: '10/03/2023',
					protocolo: '12345845',
					origem: 'Folha Mês Março/23',
					motivo: 'Atualização Mensal',
					valor_informado: 'R$ 3.000,00',
				},
			],
		},
	])

	// Script
	const clearFilter = () => {
		margem.value = ''

		selected.label = ''
		selected.type = ''
	}

	const filtered = (value: string = '') => {
		if (value === '') {
			margemTitlePercent.value = rows[0].titulo
			return rows[0].margem35
		}

		const data = rows.reduce((margem, margens: any) => {
			if (margens[value]) {
				margemTitlePercent.value = margens.titulo
				margem.push(...margens[value])
			}

			return margem
		}, [])

		return data
	}
</script>
<template>
	<main>
		<breadcrumbs :paginas="['Consultas', 'Atualização das Margens']" />

		<div class="panel pb-0 mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<consultas-titulo title="Consulta Atualização da Margem Consignável" />

				<div
					class="header_actions flex items-center gap-5 ltr:ml-auto rtl:mr-auto"
				>
					<multiselect
						v-model="margem"
						:options="[
							{
								name: 'margem35',
								label: 'Margem 35%',
							},
							{
								name: 'margem10',
								label: 'Margem 10%',
							},
							{
								name: 'margem5',
								label: 'Margem 5%',
							},
						]"
						track-by="name"
						label="label"
						class="custom-multiselect max-w-[230px]"
						placeholder="Selecione o tipo de margem"
						:searchable="false"
						:preselect-first="false"
						:allow-empty="false"
						selected-label=""
						select-label=""
						deselect-label=""
						@select="(selected.label = $event.name), (selected.type = 'margem')"
					/>

					<div>
						<button
							v-tippy:top
							type="button"
							class="text-xs m-1"
							@click="clearFilter()"
						>
							<icon-clear class="w-5 h-5 text-primary_3-table" />
						</button>
						<tippy target="top" placement="top">Limpar pesquisa</tippy>
					</div>

					<div>
						<consultas-export
							v-tippy:top
							:cols="cols"
							:rows="rows[0].margem35"
							:filename="margemTitlePercent"
							export-type="print"
						>
							<template #icon>
								<icon-printer class="w-5 h-5" />
							</template>
						</consultas-export>
						<tippy target="top" placement="top">Imprimir</tippy>
					</div>
				</div>
			</div>

			<div class="datatable">
				<span class="text-base font-semibold text-primary_3"
					>Histórico - {{ margemTitlePercent }}</span
				>
				<vue3-datatable
					:rows="filtered(selected.label)"
					:columns="cols"
					:total-rows="filtered(selected.label)?.length"
					:sortable="true"
					skin="whitespace-nowrap bh-table-striped"
					no-data-content="Nenhum dado foi encontrado"
					pagination-info="Mostrando {0} a {1} de {2} entradas"
					class="mt-4"
				>
				</vue3-datatable>
			</div>
		</div>
	</main>
</template>
<style lang="scss" scoped>
	.header_actions:deep(.custom-multiselect) {
		.multiselect__placeholder {
			font-size: 0.75rem;
			line-height: 1rem;
			font-weight: 600;
			white-space: nowrap;
			color: rgb(14 23 38);
		}
	}
</style>
