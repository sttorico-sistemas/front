<script lang="ts" setup>
import Vue3Datatable from '@bhplugin/vue3-datatable'
import { reactive, ref } from 'vue'
import titulo from 'src/core/components/Titulo.vue'
import modalLayout from 'src/core/components/Modal.vue'
import ConsultasExport from 'src/modules/consultas/components/ConsultasExport.vue'
import CadastrarConsignacao from './Modal/CadastrarConsignacao.vue'
import IconAdd from 'src/core/components/Icons/IconAdd.vue'
import IconEdit from 'src/core/components/Icons/IconEdit.vue'
import IconBlock from 'src/core/components/Icons/IconBlock.vue'
import IconCheck from 'src/core/components/Icons/IconCheck.vue'
import IconEye from 'src/core/components/Icons/IconEye.vue'
import IconPrinter from 'src/core/components/Icons/IconPrinter.vue'
import IconClear from 'src/core/components/Icons/IconClear.vue'
import { Col } from 'types/col.d'

const isOpenDialog = ref(false);
const selected = reactive({
	type: '',
	label: '',
})
const tipoServico = ref('')
const classe = ref('')
const tipoConsignacao = ref('')
const cols = reactive<Col[]>([
	{ field: 'id', title: '#', hide: true, sort: false, },
	{ field: 'servicos', title: 'Serviços', hide: false, sort: false, },
	{ field: 'classe', title: 'Classe', hide: false, sort: false, },
	{ field: 'tipo_consignacao', title: 'Tipo Consignação', hide: false, sort: false, },
	{ field: 'prazo', title: 'Prazo', hide: false, sort: false, },
	{ field: 'tipo_descto', title: 'Tipo Descto', hide: false, sort: false, },
	{ field: 'grupo_margem', title: 'Grupo Margem', hide: false, sort: false, },
	{ field: 'dt_inicio', title: 'Dt Início', hide: false, sort: false, },
	{ field: 'status', title: 'Status', hide: false, sort: false, },
	{ field: 'actions', title: 'Ações', hide: false, sort: false, },
])

const rows = reactive([
	{
		id: 1,
		servicos: 'Empréstimos',
		classe: 'Facultativa',
		tipo_consignacao: 'Amortização',
		prazo: 'Determinado',
		tipo_descto: 'Fixo',
		grupo_margem: 'Margem Principal',
		dt_inicio: '20/12/2020',
		status: 'Ativo',
	},
	{
		id: 2,
		servicos: 'Cartão Crédito',
		classe: 'Facultativa',
		tipo_consignacao: 'Pagamentos',
		prazo: 'Indeterminado',
		tipo_descto: 'Variável',
		grupo_margem: 'Margem Secundária',
		dt_inicio: '20/12/2020',
		status: 'Inativo',
	},
])

const clearFilter = () => {
	tipoServico.value = ''
	classe.value = ''
	tipoConsignacao.value = ''

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

	if (selected.type === 'tipoServico')
		return rows.filter((item: any) => item.servicos === value)

	if (selected.type === 'classe')
		return rows.filter((item: any) => item.classe === value)

	if (selected.type === 'tipoConsignacao')
		return rows.filter((item: any) => item.tipo_consignacao === value)
}

const parseCols = (): Col[] => {
	return [
		{ field: 'id', title: '#', hide: true, sort: false, },
		{ field: 'servicos', title: 'Serviços', hide: false, sort: false, },
		{ field: 'classe', title: 'Classe', hide: false, sort: false, },
		{ field: 'tipo_consignacao', title: 'Tipo Consignação', hide: false, sort: false, },
		{ field: 'prazo', title: 'Prazo', hide: false, sort: false, },
		{ field: 'tipo_descto', title: 'Tipo Descto', hide: false, sort: false, },
		{ field: 'grupo_margem', title: 'Grupo Margem', hide: false, sort: false, },
		{ field: 'dt_inicio', title: 'Dt Início', hide: false, sort: false, },
		{ field: 'status', title: 'Status', hide: false, sort: false, },
	]
}
</script>

<template>
	<main>
		<div class="panel">
			<div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
				<div class="flex items-center gap-14">
					<titulo title="Consignações Autorizadas" />
					<button @click="isOpenDialog = true" v-tippy:right>
						<icon-add />
					</button>
					<tippy target="right" placement="right">Cadastre uma nova consignação</tippy>
				</div>

				<div class="header_actions flex items-center gap-5">
					<multiselect v-model="tipoServico" :options="['Empréstimos', 'Cartão Crédito']"
						class="custom-multiselect min-w-[200px]" placeholder="Tipo Serviço" :searchable="false"
						:preselect-first="false" :allow-empty="false" selected-label="" select-label="" deselect-label=""
						@select="(selected.label = $event), (selected.type = 'tipoServico')" />
					<multiselect v-model="classe" :options="['Facultativa', 'Facultativa']"
						class="custom-multiselect min-w-[150px]" placeholder="Classe" :searchable="false" :preselect-first="false"
						:allow-empty="false" selected-label="" select-label="" deselect-label=""
						@select="(selected.label = $event), (selected.type = 'classe')" />
					<multiselect v-model="tipoConsignacao" :options="['Amortização', 'Pagamentos']"
						class="custom-multiselect min-w-[170px]" placeholder="Tipo Consignação" :searchable="false"
						:preselect-first="false" :allow-empty="false" selected-label="" select-label="" deselect-label=""
						@select="(selected.label = $event), (selected.type = 'tipoConsignacao')" />

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
				<vue3-datatable :rows="filtered(selected.label)" :columns="cols"
					:total-rows="filtered(selected.label)?.length ?? 0" :sortable="true"
					skin="whitespace-nowrap bh-table-striped mb-5" no-data-content="Nenhum dado foi encontrado"
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
		<modal-layout title="Cadastrar Nova Consignação" :is-open="isOpenDialog" size="max-w-[600px]"
			@btn-close="isOpenDialog = false">
			<cadastrar-consignacao @btn-cancelar="isOpenDialog = false" />
		</modal-layout>
	</main>
</template>
