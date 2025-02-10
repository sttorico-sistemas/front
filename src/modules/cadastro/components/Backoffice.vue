<script lang="ts" setup>
import { reactive, ref } from 'vue'
import titulo from 'src/core/components/Titulo.vue'
import Vue3Datatable from '@bhplugin/vue3-datatable'
import modalLayout from 'src/core/components/Modal.vue'
import ConsultasExport from 'src/modules/consultas/components/ConsultasExport.vue'
import CadastroModalBackoffice from './Modal/CadastrarBackoffice.vue'
import CadastroListagemModalBackoffice from './Modal/CadastrarListagemBackoffice.vue'
import IconAdd from 'src/core/components/Icons/IconAdd.vue'
import IconEdit from 'src/core/components/Icons/IconEdit.vue'
import IconEye from 'src/core/components/Icons/IconEye.vue'
import IconClear from 'src/core/components/Icons/IconClear.vue'
import IconPrinter from 'src/core/components/Icons/IconPrinter.vue'
import IconCheck from 'src/core/components/Icons/IconCheck.vue'
import IconBlock from 'src/core/components/Icons/IconBlock.vue'
import { Col } from 'types/col.d'

const isOpenDialog = ref(false)
const isOpenDialogCadastroListagemBackoffice = ref(false)
const selected = reactive({
	type: '',
	label: '',
})
const setor = ref('')
const cidade = ref('')
const status = ref('')
const cols = reactive<Col[]>([
	{ field: 'backoffice', title: 'Backoffice', hide: false, sort: false },
	{ field: 'setor', title: 'Setor', hide: false },
	{ field: 'cidade', title: 'Cidade', hide: false },
	{ field: 'status', title: 'Status', hide: false },
	{ field: 'actions', title: 'Ações', hide: false, width: '116px', sort: false },
])
const rows = reactive([
	{
		id: 1,
		backoffice: 'Backofficel Brasilia',
		setor: 'Aprovação de Contratos',
		cidade: 'Brasília - DF',
		status: 'Inativo',
	},
	{
		id: 2,
		backoffice: 'Regional Santa Catarina',
		setor: 'Cadastro de Operadores',
		cidade: 'Florianópolis - SC',
		status: 'Ativo',
	},
])

const clearFilter = () => {
	setor.value = ''
	cidade.value = ''
	status.value = ''

	selected.label = ''
	selected.type = ''
}

const color = (value: string): string | undefined => {
	switch (value) {
		case 'Ativo':
			return 'bg-success'
		case 'Liberada':
			return 'bg-success'
		case 'Inativo':
			return 'bg-warning'
	}
}

const filtered = (value: string = '') => {
	if (value === '') return rows

	if (selected.type === 'setor')
		return rows.filter((item: any) => item.setor === value)

	if (selected.type === 'status')
		return rows.filter((item: any) => item.status === value)

	if (selected.type === 'cidade')
		return rows.filter((item: any) => item.cidade === value)
}

const parseCols = (): Col[] => {
	return [
		{ field: 'id', title: '#', hide: false, sort: false },
		{ field: 'backoffice', title: 'Backoffice', hide: false, sort: false },
		{ field: 'setor', title: 'Setor', hide: false },
		{ field: 'cidade', title: 'Cidade', hide: false },
		{ field: 'status', title: 'Status', hide: false },
	]
}
</script>

<template>
	<main>
		<div class="panel">
			<div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
				<div class="flex items-center gap-14">
					<titulo title="Backoffices Cadastrados" />
					<button @click="isOpenDialog = true" v-tippy:right>
						<icon-add />
					</button>
					<tippy target="right" placement="right">Cadastre um novo backoffice</tippy>
				</div>

				<div class="header_actions flex items-center gap-5 ltr:ml-auto rtl:mr-auto">
					<multiselect v-model="setor" :options="['Aprovação de Contratos', 'Cadastro de Operadores']"
						class="custom-multiselect min-w-[200px]" placeholder="Setor" :searchable="false" :preselect-first="false"
						:allow-empty="false" selected-label="" select-label="" deselect-label=""
						@select="(selected.label = $event), (selected.type = 'setor')" />
					<multiselect v-model="cidade" :options="['Brasília - DF', 'Florianópolis - SC']"
						class="custom-multiselect min-w-[200px]" placeholder="Cidade" :searchable="false" :preselect-first="false"
						:allow-empty="false" selected-label="" select-label="" deselect-label=""
						@select="(selected.label = $event), (selected.type = 'cidade')" />
					<multiselect v-model="status" :options="['Ativo', 'Inativo']" class="custom-multiselect min-w-[122px]"
						placeholder="Status" :searchable="false" :preselect-first="false" :allow-empty="false" selected-label=""
						select-label="" deselect-label="" @select="(selected.label = $event), (selected.type = 'status')" />

					<div>
						<button v-tippy:top type="button" class="text-xs m-1" @click="clearFilter()">
							<icon-clear class="w-5 h-5 text-primary" />
						</button>
						<tippy target="top" placement="top">Limpar pesquisa</tippy>
					</div>

					<div>
						<consultas-export v-tippy:top :cols="parseCols()" :rows="rows" filename="Backoffice" export-type="print">
							<template #icon>
								<icon-printer class="w-5 h-5" />
							</template>
						</consultas-export>
						<tippy target="top" placement="top">Imprimir</tippy>
					</div>
				</div>
			</div>

			<div class="datatable">
				<vue3-datatable :rows="filtered(selected.label)" :columns="cols" :total-rows="filtered(selected.label)?.length"
					:sortable="true" skin="whitespace-nowrap bh-table-striped" no-data-content="Nenhum dado foi encontrado"
					pagination-primary="Mostrando {0} a {1} de {2} entradas">
					<template #status="data">
						<span class="flex justify-center badge !w-[80px] h-[22px]" :class="color(data.value.status)">{{
							data.value.status }}</span>
					</template>
					<template #actions="data">
						<div class="flex">
							<div>
								<button v-tippy:right type="button" class="text-xs m-1">
									<icon-eye class="w-5 h-5 text-primary" />
								</button>
								<tippy target="right" placement="right">Visualizar</tippy>
							</div>
							<div>
								<button v-tippy:right type="button" class="text-xs m-1">
									<icon-edit class="w-5 h-5 text-primary" />
								</button>
								<tippy target="right" placement="right">Editar</tippy>
							</div>
							<div>
								<button v-tippy:right type="button" class="text-xs m-1">
									<icon-check v-if="data.value.status === 'Ativo'" class="w-5 h-5 text-primary" />
									<icon-block v-else class="w-5 h-5 text-primary" />
								</button>
								<tippy target="right" placement="right">{{ data.value.status === 'Ativo' ? 'Inativar' : 'Ativar' }}
								</tippy>
							</div>
						</div>
					</template>
				</vue3-datatable>
			</div>
		</div>

		<modal-layout title="Cadastro Backoffice" :is-open="isOpenDialog" size="max-w-[490px]"
			@btn-close="isOpenDialog = false">
			<!-- Datatable-->
			<cadastro-modal-backoffice @btn-cancelar="isOpenDialog = false" />
			<!-- Datatable-->
		</modal-layout>
		<modal-layout title="Cadastro Backoffice" :is-open="isOpenDialogCadastroListagemBackoffice" size="max-w-full"
			@btn-close="isOpenDialog = false">
			<!-- Datatable-->
			<cadastro-listagem-modal-backoffice @btn-cancelar="isOpenDialogCadastroListagemBackoffice = false" />
			<!-- Datatable-->
		</modal-layout>
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

	.multiselect__option {
		font-size: 0.75rem;
		line-height: 1rem;
		white-space: normal;
	}
}
</style>
