<script lang="ts" setup>
import Vue3Datatable from '@bhplugin/vue3-datatable'
import { reactive, ref } from 'vue'

// Componentes
import titulo from 'src/core/components/Titulo.vue'
import modalLayout from 'src/core/components/Modal.vue'

import ConsultasExport from 'src/modules/consultas/components/ConsultasExport.vue'
import CadastrarMargem from './Modal/CadastrarMargem.vue'

// Icons
import IconAdd from 'src/core/components/Icons/IconAdd.vue'
import IconEdit from 'src/core/components/Icons/IconEdit.vue'
import IconBlock from 'src/core/components/Icons/IconBlock.vue'
import IconCheck from 'src/core/components/Icons/IconCheck.vue'
import IconEye from 'src/core/components/Icons/IconEye.vue'
import IconPrinter from 'src/core/components/Icons/IconPrinter.vue'
import IconClear from 'src/core/components/Icons/IconClear.vue'

// Declarações
const isOpenDialog = ref<boolean>(false);
const selected = reactive<{ type: string, label: string }>({
	type: '',
	label: '',
})
const grupoMargem = ref<string>('')
const status = ref<string>('')
const cols = reactive([
	{ field: 'id', title: '#', hide: true, sort: false, },
	{ field: 'grupo_margem', title: 'Grupo da Margem', hide: false, sort: false, },
	{ field: 'percent_margem', title: '% Margem', hide: false, sort: false, },
	{ field: 'indice_calculo', title: 'Índice p/ Cálculo', hide: false, sort: false, },
	{ field: 'dt_inicio', title: 'Dt Início', hide: false, sort: false, },
	{ field: 'dt_final', title: 'Dt Final', hide: false, sort: false, },
	{ field: 'status', title: 'Status', hide: false, sort: false, },
	{ field: 'actions', title: 'Ações', hide: false, sort: false, },
])
const rows = reactive([
	{
		id: 1,
		grupo_margem: 'Margem Principal',
		percent_margem: '35%',
		indice_calculo: '100%',
		dt_inicio: '01/10/2015',
		dt_final: '20/12/2020',
		status: 'Ativo',
	},
	{
		id: 2,
		grupo_margem: 'Margem Secundária',
		percent_margem: '5%',
		indice_calculo: '14%',
		dt_inicio: '01/10/2015',
		dt_final: '20/12/2020',
		status: 'Inativo',
	},
])

// Scripts
const clearFilter = () => {
	grupoMargem.value = ''
	status.value = ''

	selected.label = ''
	selected.type = ''
}

const color = (value: string) => {
	switch (value) {
		case 'Ativo':
			return 'bg-success'
		case 'Inativo':
			return 'bg-warning'
	}
}

const filtered = (value: string = '') => {
	if (value === '') return rows

	if (selected.type === 'grupoMargem')
		return rows.filter((item: any) => item.grupo_margem === value)

	if (selected.type === 'status')
		return rows.filter((item: any) => item.status === value)
}

const parseCols = (): Array<object> => {
	return [
		{ field: 'id', title: '#', hide: true, sort: false, },
		{ field: 'grupo_margem', title: 'Grupo da Margem', hide: false, sort: false, },
		{ field: 'percent_margem', title: '% Margem', hide: false, sort: false, },
		{ field: 'indice_calculo', title: 'Índice p/ Cálculo', hide: false, sort: false, },
		{ field: 'dt_inicio', title: 'Dt Início', hide: false, sort: false, },
		{ field: 'dt_final', title: 'Dt Final', hide: false, sort: false, },
		{ field: 'status', title: 'Status', hide: false, sort: false, },
	]
}
</script>

<template>
	<main>
		<div class="panel">
			<div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
				<div class="flex items-center gap-14">
					<titulo title="Margem Consignável" />
					<button @click="isOpenDialog = true" v-tippy:right>
						<icon-add />
					</button>
					<tippy target="right" placement="right">Cadastre uma nova margem</tippy>
				</div>

				<div class="header_actions flex items-center gap-5">
					<multiselect v-model="grupoMargem" :options="['Margem Principal', 'Margem Secundária']"
						class="custom-multiselect min-w-[200px]" placeholder="Grupo Margem" :searchable="false"
						:preselect-first="false" :allow-empty="false" selected-label="" select-label="" deselect-label=""
						@select="(selected.label = $event), (selected.type = 'grupoMargem')" />
					<multiselect v-model="status" :options="['Ativo', 'Inativo']" class="custom-multiselect min-w-[150px]"
						placeholder="Status" :searchable="false" :preselect-first="false" :allow-empty="false" selected-label=""
						select-label="" deselect-label="" @select="(selected.label = $event), (selected.type = 'status')" />

					<div>
						<button v-tippy:top type="button" class="text-xs m-1" @click="clearFilter()">
							<icon-clear class="w-5 h-5 text-primary_3-table" />
						</button>
						<tippy target="top" placement="top">Limpar pesquisa</tippy>
					</div>

					<div class="w-5 h-5">
						<consultas-export v-tippy:top :cols="parseCols()" :rows="rows" filename="Normativos Cadastrados"
							export-type="print">
							<template #icon>
								<icon-printer class="w-5 h-5" />
							</template>
						</consultas-export>
						<tippy target="top" placement="top">Imprimir</tippy>
					</div>
				</div>
			</div>

			<div class="datatable">
				<vue3-datatable :rows="filtered(selected.label)" :columns="cols" :total-rows="filtered(selected.label).length"
					:sortable="true" skin="whitespace-nowrap bh-table-striped mb-5" no-data-content="Nenhum dado foi encontrado"
					pagination-info="Mostrando {0} a {1} de {2} entradas">
					<template #status="data">
						<span class="flex justify-center badge !w-[80px] h-[22px]" :class="color(data.value.status)">{{
							data.value.status }}</span>
					</template>
					<template #actions="data">
						<div class="flex gap-2">
							<div>
								<button v-tippy:right type="button" class="text-xs m-1">
									<icon-eye class="w-5 h-5 text-primary_3-table" />
								</button>
								<tippy target="right" placement="right">Visualizar</tippy>
							</div>
							<div>
								<button v-tippy:right type="button" class="text-xs m-1">
									<icon-edit class="w-5 h-5 text-primary_3-table" />
								</button>
								<tippy target="right" placement="right">Editar</tippy>
							</div>
							<div>
								<button v-tippy:right type="button" class="text-xs m-1">
									<icon-block v-if="data.value.status === 'Ativo'" class="w-5 h-5 text-primary_3-table" />
									<icon-check v-else class="w-5 h-5 text-primary_3-table" />
								</button>
								<tippy target="right" placement="right">{{ data.value.status === 'Ativo' ? 'Inativo' : 'Ativo' }}
								</tippy>
							</div>
						</div>
					</template>
				</vue3-datatable>
			</div>
		</div>
		<modal-layout title="Cadastrar Nova Margem" :is-open="isOpenDialog" size="max-w-[600px]"
			@btn-close="isOpenDialog = false">
			<cadastrar-margem @btn-cancelar="isOpenDialog = false" />
		</modal-layout>
	</main>
</template>
