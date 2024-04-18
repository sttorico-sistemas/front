<script lang="ts" setup>
	import { ref, reactive } from 'vue'

	// Componentes
	import breadcrumbs from '@components/layout/breadcrumbsLayout.vue'

	import ConsignatariaHabilitadas from './cadastro-consignataria-habilitadas/cadastro-consignataria-habilitadas.vue'
	import ContratosSistema from './cadastro-contrato-sistema/cadastro-contrato-sistema.vue'
	import DadosConsignataria from './cadastro-dados-consignataria/cadastro-dados-consignataria.vue'
	import ListaAverbadores from './cadastro-lista-averbadores/cadastro-lista-averbadores.vue'
	import ListaGestores from './cadastro-lista-gestores/cadastro-lista-gestores.vue'
	import LogsAlteracao from './logs-alteracao/logs-alteracao.vue'

	// Icons
	import IconClear from '@icons/iconClear.vue'

	// Declarações
	const selected = reactive<{ type: string; label: string }>({
		type: '',
		label: '',
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
		{ field: 'actions', title: 'Ações', hide: false, sort: false, },
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

    <dados-consignataria />
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
    <lista-gestores />
    <lista-averbadores />
    <consignataria-habilitadas />
    <logs-alteracao />
	</main>
</template>
