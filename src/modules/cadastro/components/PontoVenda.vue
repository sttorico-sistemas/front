<script lang="ts" setup>
import { PropType, reactive, ref } from 'vue'

const props = defineProps({
	cols: {
		type: Array as PropType<Object>,
		required: true,
	},
	rows: {
		type: Array as PropType<Object>,
		required: true,
	},
	pagination: {
		type: Boolean,
		default: false,
	},
	title: {
		type: String,
		default: 'Pontos de Vendas',
	},
	administrador: {
		type: Boolean,
		default: false,
	},
	btnAdd: {
		type: Boolean,
		default: true,
	},
})

// Componentes
import titulo from 'src/core/components/Titulo.vue'
import Vue3Datatable from '@bhplugin/vue3-datatable'
import modalLayout from 'src/core/components/Modal.vue'
import ConsultasExport from 'src/modules/consultas/components/ConsultasExport.vue'

import CadastroModalPontoVenda from './Modal/CadastroPontoVenda.vue'
import CadastroModalOperadores from './Modal/CadastroOperadores.vue'

// Icons
import IconAdd from 'src/core/components/Icons/IconAdd.vue'
import IconEdit from 'src/core/components/Icons/IconEdit.vue'
import IconEye from 'src/core/components/Icons/IconEye.vue'
import IconClear from 'src/core/components/Icons/IconClear.vue'
import IconPrinter from 'src/core/components/Icons/IconPrinter.vue'
import IconCheck from 'src/core/components/Icons/IconCheck.vue'
import IconBlock from 'src/core/components/Icons/IconBlock.vue'
import IconResetPassword from 'src/core/components/Icons/IconResetPassword.vue'

// Declarações
const isOpenDialog = ref<boolean>(false)
const isOpenDialogOperadores = ref<boolean>(false)
const selected = reactive<{ type: string; label: string }>({
	type: '',
	label: '',
})
const pdv = ref<string>('')
const cidade = ref<string>('')
const perfil = ref<string>('')
const tipo_admin = ref<string>('')
const status = ref<string>('')

// Script
const clearFilter = () => {
	pdv.value = ''
	cidade.value = ''
	perfil.value = ''
	tipo_admin.value = ''
	status.value = ''

	selected.label = ''
	selected.type = ''
}

const color = (value: string): string => {
	switch (value) {
		case 'Ativo':
			return 'bg-success' // Ativo
		case 'Liberada':
			return 'bg-success'
		case 'Inativo':
			return 'bg-warning' // Inativo
		default:
			return 'bg-warning'
	}
}

const filtered = (value: string = '') => {
	if (value === '') return props.rows

	if (selected.type === 'pdv')
		return props.rows.filter((item: any) => item.pdv === value)

	if (selected.type === 'status')
		return props.rows.filter((item: any) => item.status === value)

	if (selected.type === 'cidade')
		return props.rows.filter((item: any) => item.cidade === value)

	if (selected.type === 'perfil')
		return props.rows.filter((item: any) => item.perfil === value)

	if (selected.type === 'operador')
		return props.rows.filter((item: any) => item.operador === value)

	if (selected.type === 'tp_operador')
		return props.rows.filter((item: any) => item.tp_operador === value)

	if (selected.type === 'tipo_admin')
		return props.rows.filter((item: any) => item.tipo_administrador === value)
}

const parseCols = (): Array<object> => {
	if (props.administrador) {
		return [
			{ field: 'id', title: '#', hide: false, sort: false },
			{ field: 'operador', title: 'Operador', hide: false, sort: false },
			{ field: 'tp_operador', title: 'Tp Operador', hide: false, sort: false },
			{ field: 'perfil', title: 'Perfil', hide: false, sort: false },
			{ field: 'departamento', title: 'Departamento', hide: false, sort: false },
			{ field: 'data_inicial', title: 'Data Inicial', hide: false, sort: false },
			{ field: 'data_final', title: 'Data Final', hide: false, sort: false },
			{ field: 'status', title: 'Status', hide: false },
		]
	}

	return [
		{ field: 'id', title: '#', hide: false, sort: false },
		{ field: 'ponto_venda', title: 'Ponto de Venda', hide: false },
		{ field: 'pdv', title: 'Tipo PDV', hide: false, sort: false },
		{ field: 'cidade', title: 'Cidade', hide: false },
		{ field: 'status', title: 'Status', hide: false },
	]
}

const tp_operador = ref('');
const operador = ref('');
</script>
<template>
	<main>
		<div class="panel">
			<div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
				<div class="flex items-center gap-14">
					<titulo :title="props.title" />
					<button v-if="!administrador" :class="!props.btnAdd ? 'hidden' : ''" @click="isOpenDialog = true"
						v-tippy:right>
						<icon-add />
					</button>
					<button v-else :class="!props.btnAdd ? 'hidden' : ''" @click="isOpenDialogOperadores = true" v-tippy:right>
						<icon-add />
					</button>
					<tippy target="right" placement="right">Cadastre um novo</tippy>
				</div>

				<div class="header_actions flex items-center gap-5 ltr:ml-auto rtl:mr-auto">
					<multiselect v-if="!administrador" v-model="pdv" :options="['Agência', 'PAB']"
						class="custom-multiselect min-w-[200px]" placeholder="Tipo PDV" :searchable="false" :preselect-first="false"
						:allow-empty="false" selected-label="" select-label="" deselect-label=""
						@select="(selected.label = $event), (selected.type = 'pdv')" />
					<multiselect v-if="!administrador" v-model="cidade" :options="['Brasília - DF', 'Florianópolis - SC']"
						class="custom-multiselect min-w-[200px]" placeholder="Cidade" :searchable="false" :preselect-first="false"
						:allow-empty="false" selected-label="" select-label="" deselect-label=""
						@select="(selected.label = $event), (selected.type = 'cidade')" />
					<multiselect v-if="administrador" v-model="operador" :options="['João da Silva', 'Mario Alves Cabral']"
						class="custom-multiselect min-w-[200px]" placeholder="Nome" :searchable="false" :preselect-first="false"
						:allow-empty="false" selected-label="" select-label="" deselect-label=""
						@select="(selected.label = $event), (selected.type = 'operador')" />
					<multiselect v-if="administrador" v-model="tp_operador" :options="['Suporte', 'Operacional']"
						class="custom-multiselect min-w-[120px]" placeholder="Tp Operador" :searchable="false"
						:preselect-first="false" :allow-empty="false" selected-label="" select-label="" deselect-label=""
						@select="(selected.label = $event), (selected.type = 'tp_operador')" />
					<multiselect v-if="administrador" v-model="perfil" :options="['Atendimento', 'Fechamento']"
						class="custom-multiselect min-w-[200px]" placeholder="Perfil" :searchable="false" :preselect-first="false"
						:allow-empty="false" selected-label="" select-label="" deselect-label=""
						@select="(selected.label = $event), (selected.type = 'perfil')" />
					<multiselect v-model="status" :options="['Ativo', 'Inativo']" class="custom-multiselect min-w-[122px]"
						placeholder="Status" :searchable="false" :preselect-first="false" :allow-empty="false" selected-label=""
						select-label="" deselect-label="" @select="(selected.label = $event), (selected.type = 'status')" />

					<div>
						<button v-tippy:top type="button" class="text-xs m-1" @click="clearFilter()">
							<icon-clear class="w-5 h-5 text-primary_3-table" />
						</button>
						<tippy target="top" placement="top">Limpar pesquisa</tippy>
					</div>

					<div>
						<consultas-export v-tippy:top :cols="parseCols()" :rows="props.rows" filename="" export-type="print">
							<template #icon>
								<icon-printer class="w-5 h-5" />
							</template>
						</consultas-export>
						<tippy target="top" placement="top">Imprimir</tippy>
					</div>
				</div>
			</div>

			<div class="datatable">
				<vue3-datatable :rows="filtered(selected.label)" :columns="props.cols"
					:total-rows="filtered(selected.label)?.length" :sortable="true" skin="whitespace-nowrap bh-table-striped"
					no-data-content="Nenhum dado foi encontrado" pagination-info="Mostrando {0} a {1} de {2} entradas">
					<template #status="data">
						<span class="flex justify-center badge !w-[80px] h-[22px]" :class="color(data.value.status)">{{
							data.value.status }}</span>
					</template>
					<template #actions="data">
						<div class="flex">
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
									<icon-reset-password class="w-5 h-5 text-primary_3-table" />
								</button>
								<tippy target="right" placement="right">Resetar senha</tippy>
							</div>
							<div>
								<button v-tippy:right type="button" class="text-xs m-1">
									<icon-check v-if="data.value.status === 'Ativo'" class="w-5 h-5 text-primary_3-table" />
									<icon-block v-else class="w-5 h-5 text-primary_3-table" />
								</button>
								<tippy target="right" placement="right">{{ data.value.status === 'Ativo' ? 'Inativar' : 'Ativar' }}
								</tippy>
							</div>
						</div>
					</template>
				</vue3-datatable>
			</div>
		</div>

		<modal-layout title="Cadastro Ponto de Venda" :is-open="isOpenDialog" size="max-w-[490px]"
			@btn-close="isOpenDialog = false">
			<cadastro-modal-ponto-venda @btn-cancelar="isOpenDialog = false" />
		</modal-layout>

		<modal-layout title="Cadastro Operadores" :is-open="isOpenDialogOperadores" size="max-w-[490px]"
			@btn-close="isOpenDialogOperadores = false">
			<cadastro-modal-operadores @btn-cancelar="isOpenDialogOperadores = false" />
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
