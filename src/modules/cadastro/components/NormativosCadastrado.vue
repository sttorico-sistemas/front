<script lang="ts" setup>
import Vue3Datatable from '@bhplugin/vue3-datatable'
import { reactive, ref } from 'vue'

// Componentes
import titulo from 'src/core/components/Titulo.vue'
import modalLayout from 'src/core/components/Modal.vue'

import ConsultasExport from 'src/modules/consultas/components/ConsultasExport.vue'
import CadastrarNormativo from './Modal/CadastrarNormativo.vue'

// Icons
import IconDoc from 'src/core/components/Icons/IconFile.vue'
import IconAdd from 'src/core/components/Icons/IconAdd.vue'
import IconEdit from 'src/core/components/Icons/IconEdit.vue'
import IconDelete from 'src/core/components/Icons/IconDelete.vue'
import IconBlock from 'src/core/components/Icons/IconBlock.vue'
import IconCheck from 'src/core/components/Icons/IconCheck.vue'
import IconEye from 'src/core/components/Icons/IconEye.vue'
import IconPrinter from 'src/core/components/Icons/IconPrinter.vue'
import IconClear from 'src/core/components/Icons/IconClear.vue'

// Declarações
const isOpenDialog = ref(false);
const selected = reactive<{ type: string, label: string }>({
	type: '',
	label: '',
})
const normativo = ref<string>('')
const numero = ref<string>('')
const status = ref<string>('')
const cols = reactive([
	{ field: 'id', title: '#', hide: true, sort: false, },
	{ field: 'dcto', title: 'Dcto', hide: false, sort: false, },
	{ field: 'tipo', title: 'Tipo', hide: false, sort: false, },
	{ field: 'numero', title: 'Número', hide: false, sort: false, },
	{ field: 'objeto', title: 'Objeto', hide: false, sort: false, },
	{ field: 'data_inicial', title: 'Data Inicial', hide: false, sort: false, },
	{ field: 'data_revogacao', title: 'Data Revogação', hide: false, sort: false, },
	{ field: 'status', title: 'Status', hide: false, sort: false, },
	{ field: 'actions', title: 'Ações', hide: false, sort: false, },
])
const rows = reactive([
	{
		id: 1,
		dcto: 1,
		tipo: 'Lei',
		numero: '12235/12',
		objeto: 'Estatuto Servidores',
		data_inicial: '23/03/2018',
		data_revogacao: '',
		status: 'Vigente',
	},
	{
		id: 2,
		dcto: 3,
		tipo: 'Decreto',
		numero: '254678/19',
		objeto: 'Regulamento Consignações',
		data_inicial: '23/03/2018',
		data_revogacao: '23/03/2023',
		status: 'Revogado',
	},
])

// Scripts
const clearFilter = () => {
	normativo.value = ''
	numero.value = ''
	status.value = ''

	selected.label = ''
	selected.type = ''
}

const color = (value: string) => {
	switch (value) {
		case 'Vigente':
			return 'bg-success'
		case 'Revogado':
			return 'bg-warning'
	}
}

const filtered = (value: string = '') => {
	if (value === '') return rows

	if (selected.type === 'normativo')
		return rows.filter((item: any) => item.tipo === value)

	if (selected.type === 'numero')
		return rows.filter((item: any) => item.numero === value)

	if (selected.type === 'status')
		return rows.filter((item: any) => item.status === value)
}

const parseCols = (): Array<object> => {
	return [
		{ field: 'id', title: '#', hide: true, sort: false, },
		{ field: 'dcto', title: 'Dcto', hide: false, sort: false, },
		{ field: 'tipo', title: 'Tipo', hide: false, sort: false, },
		{ field: 'numero', title: 'Número', hide: false, sort: false, },
		{ field: 'objeto', title: 'Objeto', hide: false, sort: false, },
		{ field: 'data_inicial', title: 'Data Inicial', hide: false, sort: false, },
		{ field: 'data_revogacao', title: 'Data Revogação', hide: false, sort: false, },
		{ field: 'status', title: 'Status', hide: false, sort: false, },
	]
}
</script>

<template>
	<main>
		<div class="panel">
			<div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
				<div class="flex items-center gap-14">
					<titulo title="Normativos Cadastrados" />
					<button @click="isOpenDialog = true" v-tippy:right>
						<icon-add />
					</button>
					<tippy target="right" placement="right">Cadastre um novo normativos</tippy>
				</div>

				<div class="header_actions flex items-center gap-5">
					<multiselect v-model="normativo" :options="['Lei', 'Decreto']" class="custom-multiselect min-w-[200px]"
						placeholder="Tipo Normativo" :searchable="false" :preselect-first="false" :allow-empty="false"
						selected-label="" select-label="" deselect-label=""
						@select="(selected.label = $event), (selected.type = 'normativo')" />
					<multiselect v-model="numero" :options="['12235/12', '254678/19']" class="custom-multiselect min-w-[150px]"
						placeholder="Número" :searchable="false" :preselect-first="false" :allow-empty="false" selected-label=""
						select-label="" deselect-label="" @select="(selected.label = $event), (selected.type = 'numero')" />
					<multiselect v-model="status" :options="['Vigente', 'Revogado']" class="custom-multiselect min-w-[120px]"
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
					<template #dcto="data">
						<icon-doc />
					</template>
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
									<icon-block v-if="data.value.status === 'Vigente'" class="w-5 h-5 text-primary_3-table" />
									<icon-check v-else class="w-5 h-5 text-primary_3-table" />
								</button>
								<tippy target="right" placement="right">{{ data.value.status === 'Vigente' ? 'Revogado' : 'Vigente' }}
								</tippy>
							</div>
						</div>
					</template>
				</vue3-datatable>
			</div>
		</div>
		<modal-layout title="Cadastrar Normativo" :is-open="isOpenDialog" size="max-w-[600px]"
			@btn-close="isOpenDialog = false">
			<cadastrar-normativo @btn-cancelar="isOpenDialog = false" />
		</modal-layout>
	</main>
</template>
