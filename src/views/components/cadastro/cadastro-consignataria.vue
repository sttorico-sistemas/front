<script lang="ts" setup>
	import { ref, reactive } from 'vue'
	import router from 'src/router'
	import VueCollapsible from 'vue-height-collapsible/vue3'

	// Componentes
	import breadcrumbs from '@components/layout/breadcrumbsLayout.vue'
	import titulo from '@components/layout/tituloLayout.vue'

	import ConsignatariaHabilitadas from './cadastro-consignataria-habilitadas/cadastro-consignataria-habilitadas.vue'
	import BackOffice from './cadastro-backoffice/cadastro-backoffice.vue'
	import PontoVenda from './cadastro-ponto-venda/cadastro-ponto-venda.vue'
	import ContratosSistema from './cadastro-contrato-sistema/cadastro-contrato-sistema.vue'
	import DadosConsignataria from './cadastro-dados-consignataria/cadastro-dados-consignataria.vue'
	import ConsultaConsignataria from './cadastro-consulta-consignataria/cadastro-consulta-consignataria.vue'
	import ListaGestores from './cadastro-lista-gestores/cadastro-lista-gestores.vue'
	import LogsAlteracao from './logs-alteracao/logs-alteracao.vue'

	// Icons
	import IconClear from '@icons/iconClear.vue'
	import IconCaretDown from '@icons/iconCaretDown.vue'
	import IconEye from '@icons/iconEye.vue'

	// Declarações
	const selected = reactive<{ type: string; label: string }>({
		type: '',
		label: '',
	})
	const accordians = reactive({
		backoffice: false,
		contratoSistema: false,
		gestores: false,
		pontoVenda: false,
		operadores: false,
		consignantesHabilitados: false,
		logs: false,
	})
	const contrato = ref<string>('')
	const consignante = ref<string>('')
	const data_inicial = ref<string>('')
	const data_final = ref<string>('')
	const status = ref<string>('')
	const colsContratoSistema = reactive([
		{ field: 'cod', title: 'Cód. Contrato', hide: false, sort: true, },
		{ field: 'tipo_contrato', title: 'Tipo Contrato', hide: false, sort: true, },
		{ field: 'tipo_consignante', title: 'Tipo Consignante', hide: false, sort: true, },
		{ field: 'vigencia', title: 'Vigência', hide: false, sort: true, },
		{ field: 'data_inicial', title: 'Data Inicial', hide: false, sort: true, },
		{ field: 'data_final', title: 'Data Final', hide: false, sort: true, },
		{ field: 'status', title: 'Status', hide: false, sort: true, },
		{ field: 'actions', title: 'Ações', hide: false, width: '80px', sort: false, },
	])
	const rowsContratoSistema = reactive([
		{
      cod: '55622',
      tipo_contrato: 'Contrato de Adesão',
      tipo_consignante: 'N/A',
      vigencia: '48',
      data_inicial: '23/03/2018',
      data_final: '23/03/2023',
      status: 'Ativo',
    },
    {
      cod: '55632',
      tipo_contrato: 'Aditivo Contrato',
      tipo_consignante: 'Prefeitura de Florianópolis',
      vigencia: '60',
      data_inicial: '23/03/2018',
      data_final: '23/03/2023',
      status: 'Inativo',
    },
	])
	const colsConsignatesHabilitadas = reactive([
		{ field: 'id', title: '#', hide: false, sort: false },
		{ field: 'consignante', title: 'Consignante', hide: false },
		{ field: 'tipo_instituicao', title: 'Instituição', hide: false },
		{ field: 'tipo_servicos', title: 'Serviços', hide: false },
		{ field: 'data_habilitacao', title: 'Data Habilitação', hide: false },
		{ field: 'data_renovação', title: 'Data Renovação', hide: false },
		{ field: 'status', title: 'Status', hide: false },
		{ field: 'averbacao', title: 'Averbação', hide: false },
		{ field: 'actions', title: 'Ações', hide: false, width: '116px', sort: false },
	])
	const rowsConsignatesHabilitadas = reactive([
		{
      id: 1,
			consignante: 'Prefeitura de Florianópolis',
			tipo_instituicao: 'Instituição Financeira',
			tipo_servicos: [
				{
					nome: 'Emprestimo',
					icone: 'emprestimo',
				},
			],
      data_habilitacao: '23/03/2020',
      data_renovação: '23/03/2021',
			status: 'Inativo',
      averbacao: 'Bloqueada',
		},
		{
      id: 2,
			consignante: 'Governo do Mato Grosso',
			tipo_instituicao: 'Cooperativa de Crédito',
			tipo_servicos: [
				{
					nome: 'Emprestimo',
					icone: 'emprestimo',
				},
				{
					nome: 'Mensalidade',
					icone: 'mensalidades',
				},
				{
					nome: 'Plano de Saúde',
					icone: 'plano-saude',
				},
        {
					nome: 'Seguro',
					icone: 'seguros',
				},
			],
			data_habilitacao: '15/10/2021',
      data_renovação: '15/10/2022',
			status: 'Ativo',
      averbacao: 'Liberada',
		},
	])
	const colsPontoVenda = reactive([
		{ field: 'ponto_venda', title: 'Ponto de Venda', hide: false, sort: false },
		{ field: 'pdv', title: 'Tipo PDV', hide: false },
		{ field: 'cidade', title: 'Cidade', hide: false },
		{ field: 'status', title: 'Status', hide: false },
		{ field: 'actions', title: 'Ações', hide: false, width: '116px', sort: false },
	])
	const rowsPontoVenda = reactive([
		{
      id: 1,
      ponto_venda: 'Agência Centro Florianópolis',
      pdv: 'Agência',
      cidade: 'Brasília - DF',
			status: 'Inativo',
		},
		{
      id: 2,
			ponto_venda: 'PAB - Prefeitura Florianópolis',
      pdv: 'PAB',
      cidade: 'Florianópolis - SC',
			status: 'Ativo',
		},
	])
	const colsOperadores = reactive([
		{ field: 'operador', title: 'Operador', hide: false, sort: false },
		{ field: 'perfil', title: 'Perfil', hide: false, sort: false },
		{ field: 'ponto_venda', title: 'Ponto de Venda', hide: false, sort: false },
		{ field: 'pdv', title: 'Tipo PDV', hide: false },
		{ field: 'cidade', title: 'Cidade', hide: false },
		{ field: 'status', title: 'Status', hide: false },
		{ field: 'actions', title: 'Ações', hide: false, width: '116px', sort: false },
	])
	const rowsOperadores = reactive([
		{
      id: 1,
			operador: 'João da Silva',
			perfil: 'Vendedor',
      ponto_venda: 'Agência Centro Florianópolis',
      pdv: 'Agência',
      cidade: 'Brasília - DF',
			status: 'Inativo',
		},
		{
      id: 2,
			operador: 'Mario Alves Cabral',
			perfil: 'Vendedor',
			ponto_venda: 'PAB - Prefeitura Florianópolis',
      pdv: 'PAB',
      cidade: 'Florianópolis - SC',
			status: 'Ativo',
		},
	])

	// Script
	const filtered = (value: string = '') => {
		if (value === '') return rowsContratoSistema

    if (selected.type === 'contrato')
			return rowsContratoSistema.filter((item: any) => item.tipo_contrato === value)

		if (selected.type === 'consignante')
			return rowsContratoSistema.filter((item: any) => item.tipo_consignante === value)

		if (selected.type === 'data_inicial')
			return rowsContratoSistema.filter((item: any) => item.data_inicial === value)

		if (selected.type === 'data_final')
			return rowsContratoSistema.filter((item: any) => item.data_final === value)

		if (selected.type === 'status')
			return rowsContratoSistema.filter((item: any) => item.status === value)
	}

	const clearFilter = () => {
		contrato.value = ''
		consignante.value = ''
		data_inicial.value = ''
		data_final.value = ''
		status.value = ''

		selected.label = ''
		selected.type = ''
	}

</script>
<template>
	<main>
		<breadcrumbs :paginas="['Cadastro', 'Consignatária']" />

		<consulta-consignataria />

    <dados-consignataria />

		<div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
			<button
				type="button"
				class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
				@click="accordians.contratoSistema === true ? (accordians.contratoSistema = false) : (accordians.contratoSistema = true)"
			>
				Contratos Sistema
				<div
					:class="{ 'rotate-180': accordians.contratoSistema === true }"
				>
						<icon-caret-down />
				</div>
			</button>
			<vue-collapsible :isOpen="accordians.contratoSistema === true">
				<contratos-sistema
					:cols="colsContratoSistema"
					:rows="filtered(selected.label)"
					:pagination="true"
				>
					<template #filters>
						<multiselect
							v-model="contrato"
							:options="['Contrato de Adesão', 'Aditivo Contrato']"
							class="custom-multiselect min-w-[150px]"
							placeholder="Tipo Contrato"
							:searchable="false"
							:preselect-first="false"
							:allow-empty="false"
							selected-label=""
							select-label=""
							deselect-label=""
							@select="(selected.label = $event), (selected.type = 'contrato')"
						/>
						<multiselect
							v-model="consignante"
							:options="['N/A', 'Prefeitura de Florianópolis']"
							class="custom-multiselect min-w-[200px]"
							placeholder="Consignante"
							:searchable="false"
							:preselect-first="false"
							:allow-empty="false"
							selected-label=""
							select-label=""
							deselect-label=""
							@select="(selected.label = $event), (selected.type = 'consignante')"
						/>
						<multiselect
							v-model="data_inicial"
							:options="['23/03/2018']"
							class="custom-multiselect min-w-[100px]"
							placeholder="Data Inicial"
							:searchable="false"
							:preselect-first="false"
							:allow-empty="false"
							selected-label=""
							select-label=""
							deselect-label=""
							@select="(selected.label = $event), (selected.type = 'data_inicial')"
						/>
						<multiselect
							v-model="data_final"
							:options="['23/03/2023']"
							class="custom-multiselect min-w-[100px]"
							placeholder="Data Final"
							:searchable="false"
							:preselect-first="false"
							:allow-empty="false"
							selected-label=""
							select-label=""
							deselect-label=""
							@select="(selected.label = $event), (selected.type = 'data_final')"
						/>
						<multiselect
							v-model="status"
							:options="['Ativo', 'Inativo']"
							class="custom-multiselect min-w-[100px]"
							placeholder="Status"
							:searchable="false"
							:preselect-first="false"
							:allow-empty="false"
							selected-label=""
							select-label=""
							deselect-label=""
							@select="(selected.label = $event), (selected.type = 'status')"
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
					</template>
				</contratos-sistema>
			</vue-collapsible>
		</div>

		<div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
			<button
				type="button"
				class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
				@click="accordians.backoffice === true ? (accordians.backoffice = false) : (accordians.backoffice = true)"
			>
				Backoffice
				<div
					:class="{ 'rotate-180': accordians.backoffice === true }"
				>
						<icon-caret-down />
				</div>
			</button>
			<vue-collapsible :isOpen="accordians.backoffice === true">
				<back-office />
			</vue-collapsible>
		</div>

		<div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
			<button
				type="button"
				class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
				@click="accordians.pontoVenda === true ? (accordians.pontoVenda = false) : (accordians.pontoVenda = true)"
			>
				Pontos de Vendas
				<div
					:class="{ 'rotate-180': accordians.pontoVenda === true }"
				>
					<icon-caret-down />
				</div>
			</button>
			<vue-collapsible :isOpen="accordians.pontoVenda === true">
				<ponto-venda
					:cols="colsPontoVenda"
					:rows="rowsPontoVenda"
					title="Ponto de Venda"
				/>
			</vue-collapsible>
		</div>

		<div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
			<button
				type="button"
				class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
				@click="accordians.operadores === true ? (accordians.operadores = false) : (accordians.operadores = true)"
			>
				Operadores
				<div
					:class="{ 'rotate-180': accordians.operadores === true }"
				>
						<icon-caret-down />
				</div>
			</button>
			<vue-collapsible :isOpen="accordians.operadores === true">
				<ponto-venda
					:cols="colsOperadores"
					:rows="rowsOperadores"
					title="Operadores"
					:btn-add="false"
				/>
			</vue-collapsible>
		</div>

		<div class="panel mt-6 bg-[#f6f8fa]">
      <div class="flex items-center justify-between">
        <titulo title="Perfil de Acesso para Operadores" :class-style="'text-[#1E1E1E] text-lg'" />
        <a :href="router.resolve({ name: 'cadastro-perfil-operador', params: { id: '1' } }).href" target="_blank">
					<icon-eye />
        </a>
      </div>
		</div>

		<div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
			<button
				type="button"
				class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
				@click="accordians.consignantesHabilitados === true ? (accordians.consignantesHabilitados = false) : (accordians.consignantesHabilitados = true)"
			>
				Consignantes Habilitados
				<div
					:class="{ 'rotate-180': accordians.consignantesHabilitados === true }"
				>
						<icon-caret-down />
				</div>
			</button>
			<vue-collapsible :isOpen="accordians.consignantesHabilitados === true">
				<consignataria-habilitadas
					:cols="colsConsignatesHabilitadas"
					:rows="rowsConsignatesHabilitadas"
					title="Consignantes Habilitados"
					type-screen="consignataria"
				/>
			</vue-collapsible>
		</div>

		<div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
			<button
				type="button"
				class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
				@click="accordians.logs === true ? (accordians.logs = false) : (accordians.logs = true)"
			>
				Logs de Alterações
				<div
					:class="{ 'rotate-180': accordians.logs === true }"
				>
						<icon-caret-down />
				</div>
			</button>
			<vue-collapsible :isOpen="accordians.logs === true">
    		<logs-alteracao />
			</vue-collapsible>
		</div>
	</main>
</template>
